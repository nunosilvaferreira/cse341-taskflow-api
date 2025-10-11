// /tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

test('POST /auth/register should create a new user', async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({
      name: 'Nuno',
      email: 'nuno@example.com',
      password: '123456'
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('token');
  expect(res.body.data.user.email).toBe('nuno@example.com');
});

test('POST /auth/register should fail with missing fields', async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'invalid@example.com' });

  expect(res.status).toBe(400);
});

test('POST /auth/login should authenticate a user', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      name: 'Test User',
      email: 'login@example.com',
      password: 'password'
    });

  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'login@example.com',
      password: 'password'
    });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

test('POST /auth/login should fail with wrong password', async () => {
  await request(app)
    .post('/auth/register')
    .send({
      name: 'Test User',
      email: 'wrongpass@example.com',
      password: 'correctpass'
    });

  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'wrongpass@example.com',
      password: 'incorrectpass'
    });

  expect(res.status).toBe(401);
});
