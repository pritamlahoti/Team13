const prisma = require('../../config/prisma');

const create = ({ targetUserId, targetRole, type, trigger }) =>
  prisma.notification.create({ data: { targetUserId, targetRole, type, trigger } });

module.exports = { create };
