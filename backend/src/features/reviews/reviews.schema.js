const { z } = require('zod');

const scoreSubmissionSchema = z.object({
  outcome: z.string().trim().min(1).max(200),
  feedbackText: z.string().trim().min(1).max(5000),
  // Bounded 1-1000: catches typos (e.g. an extra zero) at the boundary rather
  // than letting a bad XP value land permanently in the append-only ledger.
  xpAwarded: z.coerce.number().int().min(1).max(1000),
  // FR016: optional breakdown of xpAwarded into individual/team parts.
  individualComponent: z.coerce.number().int().optional(),
  teamComponent: z.coerce.number().int().optional(),
});

module.exports = { scoreSubmissionSchema };
