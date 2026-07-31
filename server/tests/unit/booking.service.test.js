jest.mock('../../src/lib/prisma', () => ({
  booking: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
}));
jest.mock('../../src/services/email.service', () => ({
  sendNewRequestToPsychologist: jest.fn(),
  sendApprovedToClient: jest.fn(),
  sendRejectedToClient: jest.fn(),
}));
jest.mock('../../src/services/googleForm.service', () => ({
  buildPrefilledUrl: jest.fn(() => 'https://forms.example/prefilled'),
}));

const prisma = require('../../src/lib/prisma');
const emailService = require('../../src/services/email.service');
const bookingService = require('../../src/services/booking.service');

beforeEach(() => {
  jest.clearAllMocks();
  // $transaction just invokes the callback with `prisma` itself acting as the tx client
  prisma.$transaction.mockImplementation((cb) => cb(prisma));
});

describe('createBooking', () => {
  test('creates a PENDING booking for a client request and notifies the psychologist', async () => {
    const slotStart = new Date('2026-08-03T09:00:00.000Z');
    const slotEnd = new Date('2026-08-03T10:00:00.000Z');
    const created = { id: 'b1', slotStart, slotEnd, status: 'PENDING' };
    prisma.booking.updateMany.mockResolvedValue({ count: 0 });
    prisma.booking.create.mockResolvedValue(created);

    const result = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'CLIENT_REQUEST',
      clientName: 'Ada',
      clientEmail: 'ada@example.com',
    });

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'PENDING', lockKey: slotStart }),
      })
    );
    expect(emailService.sendNewRequestToPsychologist).toHaveBeenCalledWith(created);
    expect(result.googleFormUrl).toBe('https://forms.example/prefilled');
  });

  test('creates an already-APPROVED booking for a manual reservation, no email/form url', async () => {
    const slotStart = new Date('2026-08-03T09:00:00.000Z');
    const slotEnd = new Date('2026-08-03T10:00:00.000Z');
    prisma.booking.updateMany.mockResolvedValue({ count: 0 });
    prisma.booking.create.mockResolvedValue({ id: 'b2', slotStart, slotEnd, status: 'APPROVED' });

    const result = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'MANUAL',
      clientName: 'Walk-in',
    });

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'APPROVED', expiresAt: null }) })
    );
    expect(emailService.sendNewRequestToPsychologist).not.toHaveBeenCalled();
    expect(result.googleFormUrl).toBeNull();
  });

  test('throws SlotUnavailableError on a unique constraint violation', async () => {
    prisma.booking.updateMany.mockResolvedValue({ count: 0 });
    const err = new Error('unique violation');
    err.code = 'P2002';
    prisma.booking.create.mockRejectedValue(err);

    await expect(
      bookingService.createBooking({
        slotStart: new Date(),
        slotEnd: new Date(),
        source: 'CLIENT_REQUEST',
        clientName: 'Ada',
        clientEmail: 'ada@example.com',
      })
    ).rejects.toBeInstanceOf(bookingService.SlotUnavailableError);
  });
});

describe('approveBooking', () => {
  test('approves a PENDING, non-expired booking', async () => {
    const booking = { id: 'b1', status: 'PENDING', expiresAt: new Date(Date.now() + 100000) };
    prisma.booking.findUnique.mockResolvedValue(booking);
    prisma.booking.update.mockResolvedValue({ ...booking, status: 'APPROVED' });

    const result = await bookingService.approveBooking('b1');

    expect(result.status).toBe('APPROVED');
    expect(emailService.sendApprovedToClient).toHaveBeenCalled();
  });

  test('rejects transition when booking is already APPROVED', async () => {
    prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'APPROVED' });

    await expect(bookingService.approveBooking('b1')).rejects.toBeInstanceOf(
      bookingService.InvalidTransitionError
    );
  });

  test('rejects transition when the pending booking has already expired', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      status: 'PENDING',
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(bookingService.approveBooking('b1')).rejects.toBeInstanceOf(
      bookingService.InvalidTransitionError
    );
  });
});

describe('rejectBooking', () => {
  test('rejects a PENDING booking and clears its lockKey', async () => {
    prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PENDING' });
    prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'REJECTED' });

    await bookingService.rejectBooking('b1', 'not a fit');

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'REJECTED', lockKey: null, rejectionReason: 'not a fit' }),
      })
    );
    expect(emailService.sendRejectedToClient).toHaveBeenCalled();
  });

  test('cannot reject a booking that is not PENDING', async () => {
    prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CANCELLED' });

    await expect(bookingService.rejectBooking('b1')).rejects.toBeInstanceOf(
      bookingService.InvalidTransitionError
    );
  });
});
