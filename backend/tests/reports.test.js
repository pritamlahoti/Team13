const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 6: Filtered Reports (FR010)';

async function runReportsTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken, studentUser } = await getAuthTokens();

  // TC-REP-001: Filter by moduleType
  const repTypeRes = await request('GET', '/reports?moduleType=project', null, adminToken);
  recordTest({
    group: GROUP,
    name: 'TC-REP-001: Management generates reports filtered by moduleType',
    res: repTypeRes,
    passed: repTypeRes.status === 200 && Array.isArray(repTypeRes.data),
  });

  // TC-REP-002: Filter by userId
  const repUserRes = await request('GET', `/reports?userId=${studentUser.id}`, null, adminToken);
  recordTest({
    group: GROUP,
    name: 'TC-REP-002: Management generates reports filtered by student userId',
    res: repUserRes,
    passed: repUserRes.status === 200 && Array.isArray(repUserRes.data),
  });

  // TC-REP-003: Filter by date range
  const dateFrom = new Date(Date.now() - 86400000 * 30).toISOString();
  const dateTo = new Date().toISOString();
  const repDateRes = await request('GET', `/reports?dateFrom=${dateFrom}&dateTo=${dateTo}`, null, adminToken);
  recordTest({
    group: GROUP,
    name: 'TC-REP-003: Management generates reports filtered by date range',
    res: repDateRes,
    passed: repDateRes.status === 200 && Array.isArray(repDateRes.data),
  });

  // TC-REP-004: Student forbidden from reports
  const studentRep = await request('GET', '/reports', null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-REP-004: Student attempting GET /reports receives 403 Forbidden',
    res: studentRep,
    passed: studentRep.status === 403,
  });
}

module.exports = runReportsTests;
