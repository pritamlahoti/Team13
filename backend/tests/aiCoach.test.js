const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 7: AI Coach Services (FR014, FR025, FR026)';

async function runAiCoachTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken, studentUser } = await getAuthTokens();

  // TC-AIC-001: Management triggers AI nudge
  const nudgeRes = await request(
    'POST',
    '/ai-coach/nudge',
    { userId: studentUser.id },
    adminToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-AIC-001: POST /ai-coach/nudge generates personalized motivational nudge',
    res: nudgeRes,
    passed: nudgeRes.status === 200 && !!nudgeRes.data?.message,
    details: nudgeRes.data?.message ? `Preview: "${nudgeRes.data.message.slice(0, 45)}..."` : 'Generated',
  });

  // TC-AIC-002: Student fetches natural-language progress update
  const progressRes = await request('GET', `/users/${studentUser.id}/progress-updates`, null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-AIC-002: GET /users/:id/progress-updates generates natural-language summary',
    res: progressRes,
    passed: progressRes.status === 200 && !!progressRes.data?.update,
    details: progressRes.data?.update ? `Preview: "${progressRes.data.update.slice(0, 45)}..."` : 'Generated',
  });

  // TC-AIC-003: Student cannot request nudge generation (Management only)
  const studentNudge = await request(
    'POST',
    '/ai-coach/nudge',
    { userId: studentUser.id },
    studentToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-AIC-003: Students forbidden from triggering batch nudges (403)',
    res: studentNudge,
    passed: studentNudge.status === 403,
  });
}

module.exports = runAiCoachTests;
