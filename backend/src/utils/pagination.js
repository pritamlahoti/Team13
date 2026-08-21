const { z } = require('zod');

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Shapes a [rows, total] pair (from a $transaction alongside a .count())
// into a consistent paginated response shape across every list endpoint.
function paginate({ page, limit }, [data, total]) {
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { paginationQuerySchema, paginate };
