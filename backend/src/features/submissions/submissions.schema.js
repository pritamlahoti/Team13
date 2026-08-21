const { z } = require('zod');

const createSubmissionSchema = z
  .object({
    moduleId: z.string().uuid('moduleId must be a valid UUID').optional(),
    projectId: z.string().uuid('projectId must be a valid UUID').optional(),
    // Cap keeps stored content bounded; aiCoach.service further truncates to
    // 2000 chars specifically for the Gemini prompt (a separate, smaller budget).
    contentRef: z.string().trim().max(5000).optional(),
  })
  .refine((data) => data.moduleId || data.projectId, {
    message: 'Either moduleId or projectId must be provided',
  });

module.exports = { createSubmissionSchema };
