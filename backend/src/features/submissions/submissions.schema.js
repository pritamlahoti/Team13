const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const createSubmissionSchema = z.object({
  moduleId: z.string().uuid('moduleId must be a valid UUID'),
  // Cap keeps stored content bounded; aiCoach.service further truncates to
  // 2000 chars specifically for the Gemini prompt (a separate, smaller budget).
  contentRef: z.string().trim().max(5000).optional(),
});

const listSubmissionsQuerySchema = paginationQuerySchema;

const assignTeamSchema = z.object({
  teamId: z.string().uuid('teamId must be a valid UUID'),
});

module.exports = { createSubmissionSchema, listSubmissionsQuerySchema, assignTeamSchema };
