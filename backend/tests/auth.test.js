const request = require('supertest');
const app = require('../index');

describe('Authentication', () => {
  test('POST /api/auth/register - should create new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test1@example.com', // Changed email
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userData.email);
  });

  test('POST /api/auth/login - should login user', async () => {
    // First register a user
    const userData = {
      name: 'Test User',
      email: 'test2@example.com', // Changed email
      password: 'Password123!'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Then login
    const credentials = {
      email: 'test2@example.com', // Changed email
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/auth/register - should fail with invalid data', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      password: '123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('errors');
  });
});