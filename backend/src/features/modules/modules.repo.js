const prisma = require('../../config/prisma');
const { paginate } = require('../../utils/pagination');

const create = ({ type, classification, scoringMode, dueDate, createdBy }) =>
  prisma.module.create({
    data: { type, classification, scoringMode, dueDate: dueDate || null, createdBy },
  });

const findById = (id) => prisma.module.findUnique({ where: { id } });

const list = ({ page, limit }) =>
  prisma
    .$transaction([
      prisma.module.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.module.count(),
    ])
    .then((result) => paginate({ page, limit }, result));

module.exports = { create, findById, list };
