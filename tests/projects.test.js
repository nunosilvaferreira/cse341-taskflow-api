// /tests/projects.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');

let mongoServer;
let token;
let userId;

// aumenta o tempo máximo para 30 segundos
jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // cria um utilizador de teste diretamente (sem bcrypt)
  const user = await User.create({
    name: 'TestUser',
    email: 'test@example.com',
    password: 'password'
  });
  userId = user._id.toString();

  // cria um JWT manualmente para bypass do login
  token = jwt.sign({ id: userId }, 'testsecret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Project.deleteMany({});
});

test('GET /projects should return empty array when none', async () => {
  const res = await request(app)
    .get('/projects')
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.projects || [])).toBe(true);
  expect(res.body.data.projects.length).toBe(0);
});

test('POST /projects then GET /projects returns created project', async () => {
  const createRes = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Proj A', description: 'desc' });

  expect(createRes.status).toBe(201);
  expect(createRes.body.data.project.name).toBe('Proj A');

  const getRes = await request(app)
    .get('/projects')
    .set('Authorization', `Bearer ${token}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.data.projects.length).toBe(1);
  expect(getRes.body.data.projects[0].name).toBe('Proj A');
});

test('GET /projects/:id returns 404 for unknown id', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const res = await request(app)
    .get(`/projects/${fakeId}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
});

test('GET /projects/:id returns project when exists', async () => {
  const project = await Project.create({ name: 'P1', userId });
  const res = await request(app)
    .get(`/projects/${project._id}`)
    .set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data.project.name).toBe('P1');
});
