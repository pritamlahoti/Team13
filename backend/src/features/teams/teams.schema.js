const { z } = require('zod');

const createTeamSchema = z.object({
  name: z.string().trim().min(1).max(200),
});

const addTeamMemberSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
});

module.exports = { createTeamSchema, addTeamMemberSchema };
