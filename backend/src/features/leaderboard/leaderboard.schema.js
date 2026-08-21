const { z } = require('zod');

const leaderboardQuerySchema = z.object({
  scope: z.enum(['individual', 'team']).default('individual'),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

module.exports = { leaderboardQuerySchema };
