const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const config = require('../config');

const BCRYPT_ROUNDS = 12;

class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.code = 'INVALID_CREDENTIALS';
  }
}

async function login(email, password) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) throw new InvalidCredentialsError();

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new InvalidCredentialsError();

  const accessToken = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return { accessToken };
}

async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = { login, hashPassword, verifyToken, InvalidCredentialsError };
