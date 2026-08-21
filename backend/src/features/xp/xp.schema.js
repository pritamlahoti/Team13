//sakshi Nagare
const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const yearQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

const ledgerQuerySchema = paginationQuerySchema;

module.exports = { yearQuerySchema, ledgerQuerySchema };
