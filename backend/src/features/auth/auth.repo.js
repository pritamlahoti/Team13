const prisma = require('../../config/prisma');

const USER_SUMMARY_FIELDS = { id: true, name: true, email: true, role: true, cohortYear: true };

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });

const findById = (id) =>
  prisma.user.findUnique({ where: { id }, select: USER_SUMMARY_FIELDS });

const create = ({ name, email, passwordHash, role, cohortYear }) =>
  prisma.user.create({
    data: { name, email, passwordHash, role, cohortYear: cohortYear || null },
    select: USER_SUMMARY_FIELDS,
  });

module.exports = { findByEmail, findById, create };
