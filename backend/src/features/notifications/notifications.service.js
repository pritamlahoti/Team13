const prisma = require('../../config/prisma');
const notificationsRepo = require('./notifications.repo');
const { sendEmail } = require('./emailClient');

// ponytail: default, needs team sign-off (backend PRD §8 leaves the exact
// window undecided) — how long a nudge "counts" as already sent.
const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

// ponytail: default, needs team sign-off (PRD open question #5) — how far
// past due_date a still-unscored submission has to be before it escalates.
const ESCALATION_OVERDUE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

// Records the notification regardless of email delivery outcome — the
// notifications table (PRD section 9) has no delivery-status column, it's a
// log of triggered notifications, not a delivery receipt.
async function notifyUser({ user, subject, message, type, trigger }) {
  await sendEmail({ to: user.email, subject, text: message });
  return notificationsRepo.create({ targetUserId: user.id, type, trigger });
}

// Single send path for nudges (backend PRD §8/§4.4): both the manual
// POST /ai-coach/nudge route and the scheduled job funnel through here, so
// there is exactly one place a nudge notification is ever created. Skips the
// (paid) message-generation call entirely when a recent nudge already covers
// this user.
async function sendNudgeIfDue(user, generateMessage) {
  const recent = await prisma.notification.findFirst({
    where: {
      targetUserId: user.id,
      type: 'nudge',
      sentAt: { gte: new Date(Date.now() - NUDGE_COOLDOWN_MS) },
    },
    orderBy: { sentAt: 'desc' },
  });

  if (recent) {
    return { sent: false, reason: 'recently_sent', lastSentAt: recent.sentAt };
  }

  const message = await generateMessage();
  await notifyUser({
    user,
    subject: 'A nudge from your Katalyst AI Coach',
    message,
    type: 'nudge',
    trigger: 'ai_coach_nudge',
  });
  return { sent: true, message };
}

// FR017: escalate submissions still not 'scored' once their module's
// due_date is far enough in the past. No single user owns an escalation, so
// it's targetRole: 'higher_management' — a Notification row, not an email
// (there's no role-broadcast email path in this codebase, and building one
// isn't part of FR017 as scoped here).
// Dedup is by trigger string per submission — once a submission has
// escalated, it doesn't escalate again every day the job runs.
async function raiseOverdueEscalations() {
  const cutoff = new Date(Date.now() - ESCALATION_OVERDUE_MS);
  const overdue = await prisma.submission.findMany({
    where: {
      status: { not: 'scored' },
      module: { dueDate: { lt: cutoff } },
    },
    select: { id: true },
  });

  const created = [];
  for (const submission of overdue) {
    const trigger = `escalation:submission:${submission.id}`;
    const already = await prisma.notification.findFirst({
      where: { type: 'escalation', trigger },
    });
    if (already) continue;

    created.push(
      await notificationsRepo.create({ targetRole: 'higher_management', type: 'escalation', trigger })
    );
  }
  return created;
}

module.exports = { notifyUser, sendNudgeIfDue, raiseOverdueEscalations };
