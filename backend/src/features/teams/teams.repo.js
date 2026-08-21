const prisma = require('../../config/prisma');

const create = (name) => prisma.team.create({ data: { name } });

// Duplicate (teamId, userId) pairing throws Prisma P2002 — the global error
// handler maps that to a clean 409, so no pre-check needed here.
const addMember = (teamId, userId) => prisma.teamMember.create({ data: { teamId, userId } });

const findById = (id) =>
  prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      },
    },
  });

module.exports = { create, addMember, findById };
