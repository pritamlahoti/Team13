const { z } = require('zod');

const reportQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  moduleType: z.enum(['session', 'course', 'mentoring', 'project', 'assignment', 'milestone']).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

module.exports = { reportQuerySchema };
