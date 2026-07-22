const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { createToken, requireAuth } = require('./auth');

const secret = process.env.JWT_SECRET || 'devsecret';

test('createToken puts user stuff in the jwt', () => {
  const token = createToken({ id: 1, username: 'admin' });
  const data = jwt.verify(token, secret);
  assert.equal(data.id, 1);
  assert.equal(data.username, 'admin');
});

test('requireAuth rejects request with no token', () => {
  const req = { headers: {} };
  let statusCode;
  let body;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      body = data;
    },
  };
  let calledNext = false;

  requireAuth(req, res, () => {
    calledNext = true;
  });

  assert.equal(statusCode, 401);
  assert.equal(body.error, 'login required');
  assert.equal(calledNext, false);
});

test('requireAuth rejects bad token', () => {
  const req = { headers: { authorization: 'Bearer not-a-real-token' } };
  let statusCode;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {},
  };
  let calledNext = false;

  requireAuth(req, res, () => {
    calledNext = true;
  });

  assert.equal(statusCode, 401);
  assert.equal(calledNext, false);
});

test('requireAuth lets a valid token through', () => {
  const token = createToken({ id: 2, username: 'bob' });
  const req = { headers: { authorization: 'Bearer ' + token } };
  const res = {
    status() {
      return this;
    },
    json() {},
  };
  let calledNext = false;

  requireAuth(req, res, () => {
    calledNext = true;
  });

  assert.equal(calledNext, true);
  assert.equal(req.user.username, 'bob');
});
