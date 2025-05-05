import request from 'supertest';
import express from 'express';
import sinon from 'sinon';
import session from 'express-session';
import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id;
      res.redirect('/home');
    } else {
      res.send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error during login: ' + error.message);
  }
});

describe('POST /login', () => {
  let findOneStub;
  let compareStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne').resolves({
      _id: 'mockUserId',
      username: 'testuser',
      password: 'hashedPassword',
    });
    compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should login user and redirect to /home with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(findOneStub.calledOnce).toBe(true);
    expect(compareStub.calledOnce).toBe(true);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/home');
  });

  it('should return error message with invalid credentials', async () => {
    compareStub.resolves(false);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(findOneStub.calledOnce).toBe(true);
    expect(compareStub.calledOnce).toBe(true);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Invalid credentials');
  });
});