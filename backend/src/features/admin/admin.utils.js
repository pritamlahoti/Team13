/**
 * Parses query parameters into Prisma-compatible pagination options.
 * Defaults to page 1 and limit 20, with a max limit of 100.
 */

//Sakshi Nagare
function parsePagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  let limit = parseInt(query.limit) || 20;
  
  if (limit < 1) limit = 20;
  if (limit > 100) limit = 100;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  return { page, limit, skip, take };
}

/**
 * Parses query parameters for safe sorting based on an allowed fields whitelist.
 * Defaults to a fallback field and 'desc' order if not provided or invalid.
 */
function parseSort(query, allowedFields, defaultField = 'createdAt', defaultOrder = 'desc') {
  let sortBy = query.sortBy;
  let sortOrder = query.sortOrder?.toLowerCase();
  
  if (!allowedFields.includes(sortBy)) {
    sortBy = defaultField;
  }
  
  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    sortOrder = defaultOrder;
  }
  
  return { [sortBy]: sortOrder };
}

/**
 * Formats a successful paginated response.
 */
function formatPaginatedResponse(data, totalCount, pagination) {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  };
}

/**
 * Formats a standard success response without pagination.
 */
function formatSuccessResponse(data, message) {
  const res = { success: true, data };
  if (message) res.message = message;
  return res;
}

module.exports = {
  parsePagination,
  parseSort,
  formatPaginatedResponse,
  formatSuccessResponse
};
