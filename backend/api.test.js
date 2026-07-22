const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const bcrypt = require('bcryptjs');
const { createToken } = require('./auth');

// fake db so we dont need mysql running
const dbPath = require.resolve('./db');
let queryImpl = async () => [[]];

require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: {
    query: (...args) => queryImpl(...args),
  },
};

const authRoutes = require('./routes/auth');
const trafficRoutes = require('./routes/traffic');

const app = express();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/traffic', trafficRoutes);

let server;
let base;

before(async () => {
  server = app.listen(0);
  const { port } = server.address();
  base = 'http://127.0.0.1:' + port;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function req(path, opts = {}) {
  const res = await fetch(base + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  let body = null;
  try {
    body = await res.json();
  } catch (e) {}
  return { status: res.status, body };
}

test('login needs username and password', async () => {
  const res = await req('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin' }),
  });
  assert.equal(res.status, 400);
});

test('login fails for unknown user', async () => {
  queryImpl = async () => [[]];
  const res = await req('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'nope', password: 'x' }),
  });
  assert.equal(res.status, 401);
});

test('login works with good password', async () => {
  const hash = await bcrypt.hash('secret', 8);
  queryImpl = async () => [[{ id: 1, username: 'admin', password_hash: hash }]];

  const res = await req('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'secret' }),
  });

  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.equal(res.body.username, 'admin');
});

test('traffic needs auth', async () => {
  const res = await req('/api/traffic');
  assert.equal(res.status, 401);
});

test('traffic returns rows when logged in', async () => {
  queryImpl = async () => [
    [{ id: 1, country: 'USA', vehicle_type: 'car', count: 10, recorded_at: '2025-01-01' }],
  ];
  const token = createToken({ id: 1, username: 'admin' });

  const res = await req('/api/traffic', {
    headers: { Authorization: 'Bearer ' + token },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body[0].country, 'USA');
});

test('create traffic needs fields', async () => {
  const token = createToken({ id: 1, username: 'admin' });
  const res = await req('/api/traffic', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify({ country: 'USA' }),
  });
  assert.equal(res.status, 400);
});
