/**
 * @jest-environment node
 */

import sinon from 'sinon';
import { Task } from '../../models/Task.js';

const deleteTaskHandler = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  try {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).send('Task ID is required');
    await Task.findByIdAndDelete(taskId);
    res.redirect('/home');
  } catch (error) {
    res.status(500).send('Error deleting task: ' + error.message);
  }
};

describe('Delete Task Route', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub(Task, 'findByIdAndDelete').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  test('should delete a task and redirect to /home if user is logged in', async () => {
    const mockReq = {
      session: { userId: 'test-user-id' },
      body: { taskId: 'mockTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await deleteTaskHandler(mockReq, mockRes);

    expect(deleteStub.calledOnce).toBe(true);
    expect(deleteStub.calledWith('mockTaskId')).toBe(true);
    expect(mockRes.redirect.calledWith('/home')).toBe(true);
  });

  test('should return 400 error if taskId is not provided', async () => {
    const mockReq = {
      session: { userId: 'test-user-id' },
      body: {}
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await deleteTaskHandler(mockReq, mockRes);

    expect(deleteStub.called).toBe(false);
    expect(mockRes.status.calledWith(400)).toBe(true);
    expect(mockRes.send.calledWith('Task ID is required')).toBe(true);
  });

  test('should redirect to / if user is not logged in', async () => {
    const mockReq = {
      session: {},
      body: { taskId: 'mockTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await deleteTaskHandler(mockReq, mockRes);

    expect(deleteStub.called).toBe(false);
    expect(mockRes.redirect.calledWith('/')).toBe(true);
  });
});