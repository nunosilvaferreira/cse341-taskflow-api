// /tests/tasks.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user
  const user = await User.create({ name: 'TaskUser', email: 'task@example.com', password: 'password' });
  userId = user._id.toString();

  // Login to obtain token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'task@example.com', password: 'password' });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany({});
});

test('GET /tasks should return empty array when none exist', async () => {
  const res = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.tasks)).toBe(true);
  expect(res.body.data.tasks.length).toBe(0);
});

test('POST /tasks then GET /tasks returns created task', async () => {
  const createRes = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Sample Task', description: 'testing' });

  expect(createRes.status).toBe(201);
  expect(createRes.body.data.task.title).toBe('Sample Task');

  const getRes = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.data.tasks.length).toBe(1);
  expect(getRes.body.data.tasks[0].title).toBe('Sample Task');
});

test('GET /tasks/:id returns 404 for invalid ID', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/tasks/${fakeId}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
});

test('GET /tasks/:id returns the correct task', async () => {
  const task = await Task.create({ title: 'Important Task', userId });
  const res = await request(app).get(`/tasks/${task._id}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data.task.title).toBe('Important Task');
});
