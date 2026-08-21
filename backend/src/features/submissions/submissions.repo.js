const prisma = require('../../config/prisma');

const create = (userId, moduleId, contentRef) =>
  prisma.submission.create({ data: { userId, moduleId, contentRef, status: 'pending' } });

const findById = (id) => prisma.submission.findUnique({ where: { id } });

const listPending = () =>
  prisma.submission.findMany({ where: { status: 'pending' }, orderBy: { submittedAt: 'asc' } });

const markPending = (id) =>
  prisma.submission.update({ where: { id }, data: { status: 'pending' } });

module.exports = { create, findById, listPending, markPending };
