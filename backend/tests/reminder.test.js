const request = require('supertest');
const app = require('../index');

describe('Reminders', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register and login user
    const userData = {
      name: 'Test User',
      email: 'test3@example.com', // Changed email
      password: 'Password123!'
    };

    await request(app).post('/api/auth/register').send(userData);
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user._id;
  });

  test('GET /api/reminders - should get user reminders', async () => {
    const response = await request(app)
      .get('/api/reminders')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/reminders - should create new reminder', async () => {
    const reminderData = {
      title: 'Test Reminder',
      date: new Date(),
      priority: 'high',
      repeat: 'none'
    };

    const response = await request(app)
      .post('/api/reminders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reminderData)
      .expect(201);

    expect(response.body.title).toBe(reminderData.title);
    expect(response.body.user).toBe(userId);
  });

  test('GET /api/reminders - should fail without auth', async () => {
    const response = await request(app)
      .get('/api/reminders')
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });
});