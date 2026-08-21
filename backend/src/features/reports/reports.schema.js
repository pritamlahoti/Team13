const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const reportQuerySchema = z
  .object({
    userId: z.string().uuid().optional(),
    moduleType: z.enum(['session', 'course', 'mentoring', 'project', 'assignment', 'milestone']).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    teamId: z.string().uuid().optional(),
    xpMin: z.coerce.number().int().optional(),
    xpMax: z.coerce.number().int().optional(),
  })
  .merge(paginationQuerySchema);

module.exports = { reportQuerySchema };
