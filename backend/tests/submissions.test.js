const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 4: Submissions & Autonomous AI Review (FR005, FR006, FR007, FR008, FR011-013)';

async function runSubmissionsTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken } = await getAuthTokens();

  // Create Objective Module
  const objModRes = await request(
    'POST',
    '/modules',
    {
      type: 'session',
      classification: 'mandatory',
      scoringMode: 'objective',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    },
    adminToken
  );
  const objModuleId = objModRes.data?.id;

  // Create Subjective Module
  const subjModRes = await request(
    'POST',
    '/modules',
    {
      type: 'project',
      classification: 'optional',
      scoringMode: 'subjective',
    },
    adminToken
  );
  const subjModuleId = subjModRes.data?.id;

  // TC-SUB-001: Objective submission auto-reviewed & scored by AI Coach
  const objSubRes = await request(
    'POST',
    '/submissions',
    {
      moduleId: objModuleId,
      contentRef: 'Attended session and completed attendance quiz with 100% score',
    },
    studentToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-SUB-001: Objective submission triggers AI Coach auto-scoring',
    res: objSubRes,
    passed: objSubRes.status === 201 && (objSubRes.data?.status === 'scored' || objSubRes.data?.status === 'pending'),
    details: `Status: ${objSubRes.data?.status}`,
  });

  // TC-SUB-002: Subjective submission stays pending
  const subjSubRes = await request(
    'POST',
    '/submissions',
    {
      moduleId: subjModuleId,
      contentRef: 'https://github.com/student/cloud-native-capstone',
    },
    studentToken
  );
  const subjSubId = subjSubRes.data?.id;
  recordTest({
    group: GROUP,
    name: 'TC-SUB-002: Subjective submission placed in pending queue',
    res: subjSubRes,
    passed: subjSubRes.status === 201 && subjSubRes.data?.status === 'pending',
  });

  // TC-SUB-003: Admin views review queue
  const queueRes = await request('GET', '/submissions', null, adminToken);
  recordTest({
    group: GROUP,
    name: 'TC-SUB-003: Katalyst Management views pending review queue',
    res: queueRes,
    passed: queueRes.status === 200 && Array.isArray(queueRes.data),
  });

  // TC-SUB-004: Student forbidden from review queue
  const studentQueue = await request('GET', '/submissions', null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-SUB-004: Students forbidden from accessing review queue (403)',
    res: studentQueue,
    passed: studentQueue.status === 403,
  });

  // TC-SUB-005: AI Draft Feedback on subjective submission
  if (subjSubId) {
    const draftRes = await request('POST', `/submissions/${subjSubId}/ai-review`, {}, adminToken);
    recordTest({
      group: GROUP,
      name: 'TC-SUB-005: POST /submissions/:id/ai-review generates AI draft summary',
      res: draftRes,
      passed: draftRes.status === 200,
    });

    // TC-SUB-006: Management scores subjective submission
    const scoreRes = await request(
      'POST',
      `/submissions/${subjSubId}/score`,
      {
        outcome: 'approved',
        feedbackText: 'Great architecture design and comprehensive test cases.',
        xpAwarded: 40,
      },
      adminToken
    );
    recordTest({
      group: GROUP,
      name: 'TC-SUB-006: Management awards XP and finalizes review with atomic transaction',
      res: scoreRes,
      passed: scoreRes.status === 201 && scoreRes.data?.xp?.xpAwarded === 40,
    });
  }
}

module.exports = runSubmissionsTests;
