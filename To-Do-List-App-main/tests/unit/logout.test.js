/**
 * @jest-environment node
 */

import sinon from 'sinon';
import session from 'express-session';

const logoutHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
};

describe('Logout Route', () => {
  test('should destroy session and redirect to /', async () => {
    const mockReq = {
      session: { destroy: sinon.stub().callsArg(0) }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    logoutHandler(mockReq, mockRes);

    expect(mockReq.session.destroy.calledOnce).toBe(true);
    expect(mockRes.redirect.calledWith('/')).toBe(true);
  });

  test('should return 500 error if session destruction fails', async () => {
    const mockReq = {
      session: { destroy: sinon.stub().callsArgWith(0, new Error('Session destroy error')) }
    };
    const mockRes = {
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };

    logoutHandler(mockReq, mockRes);

    expect(mockReq.session.destroy.calledOnce).toBe(true);
    expect(mockRes.status.calledWith(500)).toBe(true);
    expect(mockRes.send.calledWith('Error logging out')).toBe(true);
  });
});