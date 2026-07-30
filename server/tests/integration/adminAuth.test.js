const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');

// No DB dependency — requireAdminAuth only inspects the JWT itself.
describe('requireAdminAuth middleware', () => {
  test('rejects a request with no Authorization header', async () => {
    const res = await request(app).get('/api/admin/booking-requests');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  test('rejects a malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/admin/booking-requests')
      .set('Authorization', 'Token abc123');
    expect(res.status).toBe(401);
  });

  test('rejects an expired token', async () => {
    const expired = jwt.sign({ sub: 'admin-1' }, config.jwtSecret, { expiresIn: -10 });
    const res = await request(app)
      .get('/api/admin/booking-requests')
      .set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });

  test('rejects a token signed with the wrong secret', async () => {
    const forged = jwt.sign({ sub: 'admin-1' }, 'wrong-secret');
    const res = await request(app)
      .get('/api/admin/booking-requests')
      .set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });
});
