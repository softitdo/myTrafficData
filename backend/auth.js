const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'devsecret';

function createToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '12h' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'login required' });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = { createToken, requireAuth };
