const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const trafficRoutes = require('./routes/traffic');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/traffic', trafficRoutes);

// mysql can take a few seconds to start in docker
async function waitForDb() {
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log('waiting for db...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('db not ready');
}

waitForDb()
  .then(() => {
    app.listen(port, () => {
      console.log('server on ' + port);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
