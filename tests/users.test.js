// /tests/users.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // create a test user and register via /auth/register to obtain token
  const resRegister = await request(app)
    .post('/auth/register')
    .send({ name: 'UserTest', email: 'usertest@example.com', password: 'password' });

  token = resRegister.body.token;
  userId = resRegister.body.data.user.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // keep users for token; remove other collections if needed
});

test('GET /users should return array containing the registered user', async () => {
  const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.users)).toBe(true);
  // At least one user exists (the registered one)
  expect(res.body.data.users.length).toBeGreaterThanOrEqual(1);
  // ensure the structure
  expect(res.body.data.users[0]).toHaveProperty('email');
});

test('GET /users/:id should return 404 for unknown id', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/users/${fakeId}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
});

test('GET /users/:id should return user when exists', async () => {
  const res = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data.user.email).toBe('usertest@example.com');
});

test('GET /users should require authentication', async () => {
  const res = await request(app).get('/users'); // no token
  expect([401, 403]).toContain(res.status); // either Unauthorized or Forbidden depending on middleware
});
