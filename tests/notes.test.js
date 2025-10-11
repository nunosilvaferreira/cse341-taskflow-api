// /tests/notes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Note = require('../models/Note');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user
  const user = await User.create({ name: 'NoteUser', email: 'note@example.com', password: 'password' });
  userId = user._id.toString();

  // Login to obtain token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'note@example.com', password: 'password' });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Note.deleteMany({});
});

test('GET /notes should return empty array when none', async () => {
  const res = await request(app).get('/notes').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data.notes)).toBe(true);
  expect(res.body.data.notes.length).toBe(0);
});

test('POST /notes then GET /notes returns created note', async () => {
  const createRes = await request(app)
    .post('/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Note A', content: 'abc' });

  expect(createRes.status).toBe(201);
  expect(createRes.body.data.note.title).toBe('Note A');

  const getRes = await request(app).get('/notes').set('Authorization', `Bearer ${token}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.data.notes.length).toBe(1);
  expect(getRes.body.data.notes[0].title).toBe('Note A');
});

test('GET /notes/:id returns 404 for unknown id', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/notes/${fakeId}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
});

test('GET /notes/:id returns note when exists', async () => {
  const note = await Note.create({ title: 'N1', content: 'c', userId });
  const res = await request(app).get(`/notes/${note._id}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data.note.title).toBe('N1');
});
