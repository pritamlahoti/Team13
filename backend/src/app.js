const express = require('express');
const cors = require('cors');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./features/auth/auth.routes');
const modulesRoutes = require('./features/modules/modules.routes');
const enrollmentsRoutes = require('./features/enrollments/enrollments.routes');
const submissionsRoutes = require('./features/submissions/submissions.routes');
const reviewsRoutes = require('./features/reviews/reviews.routes');
const aiCoachRoutes = require('./features/aiCoach/aiCoach.routes');
const xpRoutes = require('./features/xp/xp.routes');
const reportsRoutes = require('./features/reports/reports.routes');

const app = express();

app.use(cors());
// Default 1kb threshold skips small responses (auth/me, single-record GETs)
// where compression CPU cost would outweigh the bandwidth saved; it only
// kicks in for the endpoints that can return real volume (reports, listings).
app.use(compression());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(authRoutes);
app.use(modulesRoutes);
app.use(enrollmentsRoutes);
app.use(submissionsRoutes);
app.use(reviewsRoutes);
app.use(aiCoachRoutes);
app.use(xpRoutes);
app.use(reportsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

module.exports = app;
