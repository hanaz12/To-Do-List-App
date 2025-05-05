/**
 * @jest-environment node
 */

import sinon from 'sinon';
import { Task } from '../../models/Task.js';

const toggleTaskStatusHandler = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task || task.userId.toString() !== req.session.userId) {
      return res.status(404).send('Task not found');
    }
    task.status = !task.status;
    await task.save();
    res.redirect('/home');
  } catch (error) {
    res.status(500).send('Error toggling task status: ' + error.message);
  }
};

describe('Task Status Toggle Route', () => {
  let findByIdStub, taskMock;

  beforeEach(() => {
    taskMock = {
      _id: 'mockTaskId',
      task: 'Test Task',
      userId: 'mockUserId',
      status: false,
      save: sinon.stub().resolves()
    };
    findByIdStub = sinon.stub(Task, 'findById').resolves(taskMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  test('should toggle task status and redirect to /home for authenticated user', async () => {
    const mockReq = {
      session: { userId: 'mockUserId' },
      body: { taskId: 'mockTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await toggleTaskStatusHandler(mockReq, mockRes);

    expect(findByIdStub.calledOnce).toBe(true);
    expect(findByIdStub.calledWith('mockTaskId')).toBe(true);
    expect(taskMock.save.calledOnce).toBe(true);
    expect(mockRes.redirect.calledWith('/home')).toBe(true);
  });

  test('should return 404 if task doesnt exist or doesnt belong to user', async () => {
    findByIdStub.resolves(null);

    const mockReq = {
      session: { userId: 'mockUserId' },
      body: { taskId: 'nonexistentTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await toggleTaskStatusHandler(mockReq, mockRes);

    expect(findByIdStub.calledOnce).toBe(true);
    expect(mockRes.status.calledWith(404)).toBe(true);
    expect(mockRes.send.calledWith('Task not found')).toBe(true);
  });

  test('should redirect to / if user is not authenticated', async () => {
    const mockReq = {
      session: {},
      body: { taskId: 'mockTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await toggleTaskStatusHandler(mockReq, mockRes);

    expect(findByIdStub.called).toBe(false);
    expect(mockRes.redirect.calledWith('/')).toBe(true);
  });

  test('should handle errors and return 500 status', async () => {
    findByIdStub.rejects(new Error('Database error'));

    const mockReq = {
      session: { userId: 'mockUserId' },
      body: { taskId: 'mockTaskId' }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    await toggleTaskStatusHandler(mockReq, mockRes);

    expect(mockRes.status.calledWith(500)).toBe(true);
    expect(mockRes.send.calledWith('Error toggling task status: Database error')).toBe(true);
  });
});