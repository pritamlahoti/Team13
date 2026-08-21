const prisma = require('../../config/prisma');

const create = ({ type, classification, scoringMode, dueDate, createdBy }) =>
  prisma.module.create({
    data: { type, classification, scoringMode, dueDate: dueDate || null, createdBy },
  });

const findById = (id) => prisma.module.findUnique({ where: { id } });

const list = () => prisma.module.findMany({ orderBy: { createdAt: 'desc' } });

module.exports = { create, findById, list };
