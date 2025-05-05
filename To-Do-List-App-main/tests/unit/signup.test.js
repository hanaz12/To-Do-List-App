import request from 'supertest';
import express from 'express';
import sinon from 'sinon';
import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error during signup: ' + error.message);
  }
});

describe('POST /signup', () => {
  let createStub;
  let hashStub;

  beforeEach(() => {
    createStub = sinon.stub(User, 'create').resolves();
    hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create user and redirect to /', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'password123' });

    expect(hashStub.calledOnce).toBe(true);
    expect(createStub.calledOnce).toBe(true);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/');
  });
});