const prisma = require('../../config/prisma');
const { paginate } = require('../../utils/pagination');

const create = (userId, moduleId, contentRef) =>
  prisma.submission.create({ data: { userId, moduleId, contentRef, status: 'pending' } });

const findById = (id) => prisma.submission.findUnique({ where: { id } });

const listPending = ({ page, limit }) =>
  prisma
    .$transaction([
      prisma.submission.findMany({
        where: { status: 'pending' },
        orderBy: { submittedAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.submission.count({ where: { status: 'pending' } }),
    ])
    .then((result) => paginate({ page, limit }, result));

const markPending = (id) =>
  prisma.submission.update({ where: { id }, data: { status: 'pending' } });

// FR015: individual/team tagging.
const setTeam = (id, teamId) => prisma.submission.update({ where: { id }, data: { teamId } });

module.exports = { create, findById, listPending, markPending, setTeam };
