const { z } = require('zod');

const yearQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

module.exports = { yearQuerySchema };
