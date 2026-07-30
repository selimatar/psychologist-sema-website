const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken } = await authService.login(email, password);
    res.json({ accessToken });
  } catch (err) {
    if (err instanceof authService.InvalidCredentialsError) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
    next(err);
  }
}

module.exports = { login };
