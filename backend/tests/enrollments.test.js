const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 3: Enrollment Management (FR003, FR004)';

async function runEnrollmentsTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken } = await getAuthTokens();

  // Create a dedicated module for enrollment testing
  const modRes = await request(
    'POST',
    '/modules',
    {
      type: 'course',
      classification: 'optional',
      scoringMode: 'objective',
    },
    adminToken
  );
  const targetModuleId = modRes.data?.id;

  // TC-ENR-001: Student enrolls in module
  const enrollRes = await request(
    'POST',
    '/enrollments',
    { moduleId: targetModuleId },
    studentToken
  );
  const enrollmentId = enrollRes.data?.id;
  recordTest({
    group: GROUP,
    name: 'TC-ENR-001: Student enrolls in module (status: enrolled)',
    res: enrollRes,
    passed: enrollRes.status === 201 && enrollRes.data?.status === 'enrolled',
  });

  // TC-ENR-002: List my enrollments
  const listRes = await request('GET', '/enrollments', null, studentToken);
  const found = Array.isArray(listRes.data) && listRes.data.some((e) => e.moduleId === targetModuleId);
  recordTest({
    group: GROUP,
    name: 'TC-ENR-002: GET /enrollments returns student enrolled list',
    res: listRes,
    passed: listRes.status === 200 && found,
  });

  // TC-ENR-003: Mark completed
  if (enrollmentId) {
    const compRes = await request('PATCH', `/enrollments/${enrollmentId}/complete`, {}, studentToken);
    recordTest({
      group: GROUP,
      name: 'TC-ENR-003: PATCH /enrollments/:id/complete marks status as completed',
      res: compRes,
      passed: compRes.status === 200 && compRes.data?.status === 'completed',
    });
  }

  // TC-ENR-004: 404 for invalid enrollment complete
  const badCompRes = await request('PATCH', '/enrollments/00000000-0000-0000-0000-000000000000/complete', {}, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-ENR-004: PATCH /enrollments/:id/complete returns 404 for invalid ID',
    res: badCompRes,
    passed: badCompRes.status === 404,
  });
}

module.exports = runEnrollmentsTests;
