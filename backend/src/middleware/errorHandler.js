const { Prisma } = require('@prisma/client');

// Maps known Prisma error codes to the HTTP status a client can act on,
// instead of letting Prisma's internal (and sometimes schema-revealing)
// error text reach the response.
const PRISMA_ERROR_MAP = {
  P2002: { status: 409, message: 'A record with that value already exists' },
  P2025: { status: 404, message: 'Record not found' },
  P2003: { status: 400, message: 'Related record not found' },
};

function resolveError(err) {
  // Handle invalid JSON body payloads gracefully
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return { status: 400, message: 'Invalid JSON payload sent in the request body.' };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && PRISMA_ERROR_MAP[err.code]) {
    return PRISMA_ERROR_MAP[err.code];
  }
  // err.status marks an operational error we threw deliberately (httpError) —
  // its message is safe to show. Anything else is unexpected: log it in full
  // server-side, but don't leak internals (stack traces, DB error text) to the client.
  if (err.status) return { status: err.status, message: err.message };
  return { status: 500, message: 'Internal server error' };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Only log if it's an unexpected internal error (not a simple bad JSON payload)
  if (!(err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
    console.error(err);
  }
  
  const { status, message } = resolveError(err);
  res.status(status).json({ success: false, error: { message } });
}

module.exports = errorHandler;
