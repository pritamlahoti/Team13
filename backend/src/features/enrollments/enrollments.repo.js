const prisma = require('../../config/prisma');

const create = (userId, moduleId) =>
  prisma.enrollment.create({ data: { userId, moduleId, status: 'enrolled' } });

const findById = (id) => prisma.enrollment.findUnique({ where: { id } });

const listForUser = (userId) => prisma.enrollment.findMany({ where: { userId } });

const markCompleted = (id) =>
  prisma.enrollment.update({ where: { id }, data: { status: 'completed' } });

module.exports = { create, findById, listForUser, markCompleted };
