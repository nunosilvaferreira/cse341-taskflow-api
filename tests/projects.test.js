// /tests/projects.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user
  const user = await User.create({ name: 'Test', email: 'test@example.com', password: 'password' });
  userId = user._id.toString();

  // Login to obtain token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'password' });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Project.deleteMany({});
});

test('GET /projects should return empty array when none', async () => {
  const res = await request(app).get('/projects').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.projects)).toBe(true);
  expect(res.body.data.projects.length).toBe(0);
});

test('POST /projects then GET /projects returns created project', async () => {
  const createRes = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Proj A', description: 'desc' });

  expect(createRes.status).toBe(201);
  expect(createRes.body.data.project.name).toBe('Proj A');

  const getRes = await request(app).get('/projects').set('Authorization', `Bearer ${token}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.data.projects.length).toBe(1);
  expect(getRes.body.data.projects[0].name).toBe('Proj A');
});

test('GET /projects/:id returns 404 for unknown id', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/projects/${fakeId}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
});

test('GET /projects/:id returns project when exists', async () => {
  const project = await Project.create({ name: 'P1', userId });
  const res = await request(app).get(`/projects/${project._id}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data.project.name).toBe('P1');
});
