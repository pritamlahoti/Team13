const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepo = require('./auth.repo');

const BCRYPT_COST = 11;

function signToken(user) {
  return jwt.sign({ user_id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '24h',
  });
}

async function signup({ name, email, password, role, cohortYear }) {
  const existing = await authRepo.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const user = await authRepo.create({ name, email, passwordHash, role, cohortYear });
  return { user, token: signToken(user) };
}

async function login(email, password) {
  const user = await authRepo.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token: signToken(user) };
}

const me = (userId) => authRepo.findById(userId);

module.exports = { signup, login, me };
