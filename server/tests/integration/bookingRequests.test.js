// Requires a real Postgres database migrated with this project's schema.
// Set TEST_DATABASE_URL (and run `npm run prisma:migrate` against it once)
// before these tests will do anything; otherwise the whole suite is skipped.
// This is intentional: no DB is available in this environment yet, but the
// suite is ready to run as soon as real Supabase credentials exist.
const hasTestDb = !!process.env.TEST_DATABASE_URL;

if (hasTestDb) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const maybeDescribe = hasTestDb ? describe : describe.skip;

maybeDescribe('POST /api/booking-requests (integration)', () => {
  let request;
  let app;
  let prisma;

  beforeAll(() => {
    request = require('supertest');
    app = require('../../src/app');
    prisma = require('../../src/lib/prisma');
  });

  afterEach(async () => {
    await prisma.booking.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function slot(hoursFromNow) {
    const start = new Date(Date.now() + hoursFromNow * 3600000);
    const end = new Date(start.getTime() + 3600000);
    return { slotStart: start.toISOString(), slotEnd: end.toISOString() };
  }

  test('creates a PENDING booking request and returns a googleFormUrl', async () => {
    const res = await request(app)
      .post('/api/booking-requests')
      .send({ name: 'Ada Lovelace', email: 'ada@example.com', topic: 'stress', ...slot(48) });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('PENDING');
    expect(res.body).toHaveProperty('googleFormUrl');

    const stored = await prisma.booking.findUnique({ where: { id: res.body.id } });
    expect(stored.clientEmail).toBe('ada@example.com');
  });

  test('two concurrent requests for the same slot: exactly one 201, one 409', async () => {
    const shared = slot(72);
    const payload = (name) => ({ name, email: `${name}@example.com`, ...shared });

    const [resA, resB] = await Promise.all([
      request(app).post('/api/booking-requests').send(payload('alice')),
      request(app).post('/api/booking-requests').send(payload('bob')),
    ]);

    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([201, 409]);
  });

  test('rejects invalid payloads with 400', async () => {
    const res = await request(app).post('/api/booking-requests').send({ name: '', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });
});
