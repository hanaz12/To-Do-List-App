/**
 * @jest-environment node
 */

import sinon from 'sinon';
import { Task } from '../../models/Task.js';

const addTaskHandler = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  try {
    const { task } = req.body;
    await Task.create({ task, userId: req.session.userId });
    res.redirect('/home');
  } catch (error) {
    res.status(500).send('Error adding task: ' + error.message);
  }
};

describe('Add Task Route', () => {
  let createStub;

  beforeEach(() => {
    createStub = sinon.stub(Task, 'create').resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  test('should add a new task and redirect to /home if user is logged in', async () => {
    const mockReq = {
      session: { userId: 'test-user-id' },
      body: { task: 'New Task' }
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await addTaskHandler(mockReq, mockRes);
    
    expect(createStub.calledOnce).toBe(true);
    expect(createStub.calledWith({ 
      task: 'New Task', 
      userId: 'test-user-id' 
    })).toBe(true);
    expect(mockRes.redirect.calledWith('/home')).toBe(true);
  });

  test('should redirect to / if user is not logged in', async () => {
    const mockReq = {
      session: {},
      body: { task: 'New Task' }
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await addTaskHandler(mockReq, mockRes);
    
    expect(createStub.called).toBe(false);
    expect(mockRes.redirect.calledWith('/')).toBe(true);
  });
});