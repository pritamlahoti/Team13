const cron = require('node-cron');
const prisma = require('../config/prisma');
const aiCoachService = require('../features/aiCoach/aiCoach.service');
const notificationsService = require('../features/notifications/notifications.service');
const { ROLES } = require('../constants/roles');

// ponytail: default, needs team sign-off (PRD open question #4 leaves
// "reduced activity" undefined) — a student qualifies for a nudge when they
// have no Submission row in this many days.
const INACTIVITY_THRESHOLD_DAYS = 7;

// Daily at 08:00 server time — one schedule for both nudges and escalations
// (backend PRD §4.4: "a scheduled job... should generate nudges on an
// interval, not per-request"), so there's one cron job, not two.
const CRON_SCHEDULE = '0 8 * * *';

async function runNudgeCheck() {
  const cutoff = new Date(Date.now() - INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);
  const inactiveStudents = await prisma.user.findMany({
    where: {
      role: ROLES.STUDENT,
      submissions: { none: { submittedAt: { gte: cutoff } } },
    },
    select: { id: true, name: true, email: true },
  });

  for (const student of inactiveStudents) {
    try {
      // Shares the exact same check-then-send path as POST /ai-coach/nudge,
      // so a student never gets double-nudged regardless of which trigger fires.
      await notificationsService.sendNudgeIfDue(student, () => aiCoachService.generateNudge(student));
    } catch (err) {
      // One student's failure (Gemini/email hiccup) shouldn't stop the rest.
      console.error(`nudgeScheduler: failed to nudge user ${student.id}:`, err.message);
    }
  }
}

async function runEscalationCheck() {
  try {
    await notificationsService.raiseOverdueEscalations();
  } catch (err) {
    console.error('nudgeScheduler: escalation check failed:', err.message);
  }
}

async function runDailyJob() {
  await runNudgeCheck();
  await runEscalationCheck();
}

// Schedules the job; does nothing at require()-time so the orchestrator
// wires it in deliberately (e.g. from server.js).
function start() {
  return cron.schedule(CRON_SCHEDULE, () => {
    runDailyJob().catch((err) => console.error('nudgeScheduler: daily job failed:', err.message));
  });
}

module.exports = { start, runDailyJob, runNudgeCheck, runEscalationCheck };
