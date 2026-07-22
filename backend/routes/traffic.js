const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, country, vehicle_type, count, recorded_at FROM traffic ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/by-country', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT country, SUM(count) AS total FROM traffic GROUP BY country ORDER BY total DESC'
    );
    const result = [];
    for (const row of rows) {
      result.push({ country: row.country, total: Number(row.total) });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/by-vehicle', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT vehicle_type, SUM(count) AS total FROM traffic GROUP BY vehicle_type ORDER BY total DESC'
    );
    const result = [];
    for (const row of rows) {
      result.push({ vehicle_type: row.vehicle_type, total: Number(row.total) });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { country, vehicle_type, count, recorded_at } = req.body || {};

  if (!country || !vehicle_type || count == null) {
    return res.status(400).json({ error: 'missing fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO traffic (country, vehicle_type, count, recorded_at) VALUES (?, ?, ?, ?)',
      [country, vehicle_type, Number(count), recorded_at || new Date()]
    );
    const [rows] = await pool.query(
      'SELECT id, country, vehicle_type, count, recorded_at FROM traffic WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not save' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { country, vehicle_type, count, recorded_at } = req.body || {};
  const id = req.params.id;

  if (!country || !vehicle_type || count == null) {
    return res.status(400).json({ error: 'missing fields' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE traffic SET country = ?, vehicle_type = ?, count = ?, recorded_at = ? WHERE id = ?',
      [country, vehicle_type, Number(count), recorded_at || new Date(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    const [rows] = await pool.query(
      'SELECT id, country, vehicle_type, count, recorded_at FROM traffic WHERE id = ?',
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not update' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM traffic WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not delete' });
  }
});

module.exports = router;
