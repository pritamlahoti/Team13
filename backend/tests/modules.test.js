const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 2: Module Management (FR001, FR002)';

async function runModulesTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken } = await getAuthTokens();

  // TC-MOD-001: Create module types
  const types = ['session', 'course', 'mentoring', 'project', 'assignment', 'milestone'];
  let createdCount = 0;
  let sampleModuleId = null;
  let lastModRes = null;

  for (const type of types) {
    const isMandatory = type === 'session' || type === 'project';
    const res = await request(
      'POST',
      '/modules',
      {
        type,
        classification: isMandatory ? 'mandatory' : 'optional',
        scoringMode: type === 'session' || type === 'assignment' ? 'objective' : 'subjective',
        dueDate: isMandatory ? new Date(Date.now() + 86400000 * 14).toISOString() : null,
      },
      adminToken
    );
    lastModRes = res;
    if (res.status === 201 && res.data?.id) {
      createdCount++;
      sampleModuleId = res.data.id;
    }
  }
  recordTest({
    group: GROUP,
    name: 'TC-MOD-001: Management creates modules across all 6 activity types',
    res: lastModRes,
    passed: createdCount === 6,
    details: `Created ${createdCount}/6 module types`,
  });

  // TC-MOD-002: Mandatory requires dueDate validation
  const missingDueDate = await request(
    'POST',
    '/modules',
    {
      type: 'session',
      classification: 'mandatory',
      scoringMode: 'objective',
      // missing dueDate
    },
    adminToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-MOD-002: Mandatory module rejects missing dueDate with 400 Bad Request',
    res: missingDueDate,
    passed: missingDueDate.status === 400,
  });

  // TC-MOD-003: Student forbidden from creating modules
  const studentCreate = await request(
    'POST',
    '/modules',
    {
      type: 'course',
      classification: 'optional',
      scoringMode: 'objective',
    },
    studentToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-MOD-003: Student attempting POST /modules receives 403 Forbidden',
    res: studentCreate,
    passed: studentCreate.status === 403,
  });

  // TC-MOD-004: List modules
  const listRes = await request('GET', '/modules', null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-MOD-004: GET /modules returns array of active modules',
    res: listRes,
    passed: listRes.status === 200 && Array.isArray(listRes.data),
  });

  // TC-MOD-005: Get single module
  const singleRes = await request('GET', `/modules/${sampleModuleId}`, null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-MOD-005: GET /modules/:id returns valid module object',
    res: singleRes,
    passed: singleRes.status === 200 && singleRes.data?.id === sampleModuleId,
  });

  // TC-MOD-006: 404 for non-existent module
  const notFoundRes = await request('GET', '/modules/00000000-0000-0000-0000-000000000000', null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-MOD-006: GET /modules/:id returns 404 for non-existent UUID',
    res: notFoundRes,
    passed: notFoundRes.status === 404,
  });
}

module.exports = runModulesTests;
