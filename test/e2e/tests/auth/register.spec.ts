import { test, expect } from '../../fixtures/api-fixture.js'
import { buildUserPayload } from '../../fixtures/test-data.js';

test.describe('POST /students/', () => {
    test('creates a new user with valid data', async ({ apiContext }) => {
    const payload = buildUserPayload();

    const res = await apiContext.post('/students/', { data: payload });

    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(body.status).toBe('success');
    expect(body.token).toBeDefined();
    expect(body.data.newUser).toMatchObject({
      email: payload.email,
      name: payload.name,
      role: 'student',
    });
    expect(body.data.newUser).not.toHaveProperty('password');
  });

  test('rejects duplicate email with 409', async ({ apiContext }) => {
    const payload = buildUserPayload();
    await apiContext.post('/students/', { data: payload });

    const res = await apiContext.post('/students/', { data: payload });

    expect(res.status()).toBe(409);
  });

  test('rejects invalid email via Zod validation with 400', async ({ apiContext }) => {
    const res = await apiContext.post('/students/', {
      data: { email: 'not-an-email', password: 'Password123!' },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();

    expect(body.error).toBe('Validation failed');
    expect(body.details).toBeInstanceOf(Array);
    expect(body.details[0]).toMatchObject({
      path: 'email',
      message: 'Invalid email address',
    });
  });
});