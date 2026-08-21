require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Katalyst backend listening on port ${PORT}`));

// Safety net for errors outside the Express request lifecycle (startup,
// fire-and-forget async work) — errorHandler.js only catches what happens
// inside a route. The process is in an unknown state after either of these,
// so log and exit rather than keep serving requests on top of it.
function crash(label, err) {
  console.error(`${label}:`, err);
  server.close(() => process.exit(1));
}

process.on('unhandledRejection', (err) => crash('Unhandled rejection', err));
process.on('uncaughtException', (err) => crash('Uncaught exception', err));
