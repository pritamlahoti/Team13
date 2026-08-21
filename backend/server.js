require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/prisma');
const nudgeScheduler = require('./src/jobs/nudgeScheduler');

const PORT = process.env.PORT || 4000;
const SHUTDOWN_TIMEOUT_MS = 30_000;


const server = app.listen(PORT, () => console.log(`Katalyst backend listening on port ${PORT}`));
const scheduledNudgeJob = nudgeScheduler.start();

// Controlled shutdown (SIGTERM/SIGINT): stop accepting new connections, let
// in-flight requests finish, close the DB pool — but don't wait forever on a
// request that never completes, so force-exit past SHUTDOWN_TIMEOUT_MS.
function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);

  const forceExit = setTimeout(() => {
    console.error(`Graceful shutdown timed out after ${SHUTDOWN_TIMEOUT_MS}ms, forcing exit`);
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  scheduledNudgeJob.stop();
  server.close(async (err) => {
    if (err) console.error('Error closing server:', err);
    await prisma.$disconnect();
    clearTimeout(forceExit);
    process.exit(err ? 1 : 0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Safety net for errors outside the Express request lifecycle (startup,
// fire-and-forget async work) — errorHandler.js only catches what happens
// inside a route. The process is in an unknown state after either of these,
// so exit immediately rather than attempt async cleanup on top of it.
function crash(label, err) {
  console.error(`${label}:`, err);
  server.close(() => process.exit(1));
}

process.on('unhandledRejection', (err) => crash('Unhandled rejection', err));
process.on('uncaughtException', (err) => crash('Uncaught exception', err));
