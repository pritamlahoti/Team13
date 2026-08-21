const { z } = require('zod');

const createEnrollmentSchema = z.object({
  moduleId: z.string().uuid('moduleId must be a valid UUID'),
});

module.exports = { createEnrollmentSchema };
