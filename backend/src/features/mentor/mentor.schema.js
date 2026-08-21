const { z } = require('zod');

const studentParamsSchema = z.object({
  studentId: z.string().uuid('studentId must be a valid UUID'),
});

module.exports = { studentParamsSchema };
