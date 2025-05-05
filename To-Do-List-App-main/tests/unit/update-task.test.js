/**
 * @jest-environment node
 */

import sinon from 'sinon';
import { Task } from '../../models/Task.js';

const updateTaskHandler = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  try {
    const { taskId, task } = req.body;
    if (!taskId || !task) return res.status(400).send('Task ID and task are required');
    await Task.findByIdAndUpdate(taskId, { task });
    res.redirect('/home');
  } catch (error) {
    res.status(500).send('Error updating task: ' + error.message);
  }
};

describe('Task Update Route', () => {
  let updateStub;

  beforeEach(() => {
    updateStub = sinon.stub(Task, 'findByIdAndUpdate').resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  test('should update task and redirect to /home for authenticated user', async () => {
    const mockReq = {
      session: { userId: 'test-user-id' },
      body: { taskId: 'mockTaskId', task: 'Updated task' }
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await updateTaskHandler(mockReq, mockRes);
    
    expect(updateStub.calledOnce).toBe(true);
    expect(updateStub.calledWith('mockTaskId', { task: 'Updated task' })).toBe(true);
    expect(mockRes.redirect.calledWith('/home')).toBe(true);
  });

  test('should return 400 error if taskId or task is missing', async () => {
    const mockReq = {
      session: { userId: 'test-user-id' },
      body: {}
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await updateTaskHandler(mockReq, mockRes);
    
    expect(updateStub.called).toBe(false);
    expect(mockRes.status.calledWith(400)).toBe(true);
    expect(mockRes.send.calledWith('Task ID and task are required')).toBe(true);
  });

  test('should redirect to / if user is not authenticated', async () => {
    const mockReq = {
      session: {},
      body: { taskId: 'mockTaskId', task: 'Updated task' }
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await updateTaskHandler(mockReq, mockRes);
    
    expect(updateStub.called).toBe(false);
    expect(mockRes.redirect.calledWith('/')).toBe(true);
  });

  test('should handle database errors and return 500 status', async () => {
    updateStub.rejects(new Error('Database connection failed'));

    const mockReq = {
      session: { userId: 'test-user-id' },
      body: { taskId: 'mockTaskId', task: 'Updated task' }
    };
    
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await updateTaskHandler(mockReq, mockRes);
    
    expect(mockRes.status.calledWith(500)).toBe(true);
    expect(mockRes.send.calledWith('Error updating task: Database connection failed')).toBe(true);
  });
});