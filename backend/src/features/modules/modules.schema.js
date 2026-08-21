const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const listModulesQuerySchema = paginationQuerySchema;

const createModuleSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    rewardXp: z.coerce.number().int().min(0).max(1000).optional(),
    type: z.enum(['session', 'course', 'mentoring', 'project', 'assignment', 'milestone']),
    classification: z.enum(['mandatory', 'optional', 'certificate']),
    scoringMode: z.enum(['objective', 'subjective']).default('subjective'),
    dueDate: z.coerce.date().optional(),
  })
  .refine((data) => data.classification !== 'mandatory' || data.dueDate, {
    message: 'dueDate is required for mandatory modules',
    path: ['dueDate'],
  });

module.exports = { createModuleSchema, listModulesQuerySchema };
