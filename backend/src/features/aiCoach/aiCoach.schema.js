const { z } = require('zod');

const nudgeSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
});

module.exports = { nudgeSchema };
