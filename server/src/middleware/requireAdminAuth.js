const authService = require('../services/auth.service');

function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  try {
    req.admin = authService.verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

module.exports = requireAdminAuth;
