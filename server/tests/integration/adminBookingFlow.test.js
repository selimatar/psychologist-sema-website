// Same DB requirement as bookingRequests.test.js — see the comment there.
const hasTestDb = !!process.env.TEST_DATABASE_URL;

if (hasTestDb) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

jest.mock('../../src/services/email.service', () => ({
  sendNewRequestToPsychologist: jest.fn(),
  sendApprovedToClient: jest.fn(),
  sendRejectedToClient: jest.fn(),
}));

const maybeDescribe = hasTestDb ? describe : describe.skip;

maybeDescribe('admin booking flow (integration)', () => {
  let prisma;
  let bookingService;
  let emailService;
  let jwt;
  let config;
  let adminToken;

  beforeAll(async () => {
    prisma = require('../../src/lib/prisma');
    bookingService = require('../../src/services/booking.service');
    emailService = require('../../src/services/email.service');
    jwt = require('jsonwebtoken');
    config = require('../../src/config');
    adminToken = jwt.sign({ sub: 'admin-1' }, config.jwtSecret);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await prisma.booking.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function slot(hoursFromNow) {
    const start = new Date(Date.now() + hoursFromNow * 3600000);
    const end = new Date(start.getTime() + 3600000);
    return { slotStart: start, slotEnd: end };
  }

  test('approving a PENDING request sends the client email and locks the slot', async () => {
    const { slotStart, slotEnd } = slot(24);
    const { booking } = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'CLIENT_REQUEST',
      clientName: 'Grace',
      clientEmail: 'grace@example.com',
    });

    const approved = await bookingService.approveBooking(booking.id);

    expect(approved.status).toBe('APPROVED');
    expect(emailService.sendApprovedToClient).toHaveBeenCalledTimes(1);
  });

  test('a manual reservation cannot be created on a slot already held by a pending client request', async () => {
    const { slotStart, slotEnd } = slot(24);
    await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'CLIENT_REQUEST',
      clientName: 'Grace',
      clientEmail: 'grace@example.com',
    });

    await expect(
      bookingService.createBooking({
        slotStart,
        slotEnd,
        source: 'MANUAL',
        clientName: 'Walk-in',
      })
    ).rejects.toBeInstanceOf(bookingService.SlotUnavailableError);
  });

  test('rejecting frees the slot for a new request', async () => {
    const { slotStart, slotEnd } = slot(24);
    const { booking } = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'CLIENT_REQUEST',
      clientName: 'Grace',
      clientEmail: 'grace@example.com',
    });

    await bookingService.rejectBooking(booking.id, 'schedule conflict');

    const { booking: second } = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'MANUAL',
      clientName: 'Walk-in',
    });

    expect(second.status).toBe('APPROVED');
  });
});
