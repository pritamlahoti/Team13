const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 5: XP Ledger & Yearly Aggregations (FR008, FR009)';

async function runXpTests() {
  console.log(`\n--- [${GROUP}] ---`);
  const { adminToken, studentToken, studentUser } = await getAuthTokens();

  // TC-XP-001: Student views own yearly XP
  const xpRes = await request('GET', `/users/${studentUser.id}/xp?year=2026`, null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-XP-001: Student views own total yearly XP for given year',
    res: xpRes,
    passed: xpRes.status === 200 && typeof xpRes.data?.totalXp === 'number',
    details: `Total XP: ${xpRes.data?.totalXp}`,
  });

  // TC-XP-002: Student views own XP audit ledger
  const ledgerRes = await request('GET', `/users/${studentUser.id}/xp/ledger`, null, studentToken);
  const isValidLedger = Array.isArray(ledgerRes.data) && (ledgerRes.data.length === 0 || !!ledgerRes.data[0].xpAwarded);
  recordTest({
    group: GROUP,
    name: 'TC-XP-002: Student views full audit ledger of XP history',
    res: ledgerRes,
    passed: ledgerRes.status === 200 && isValidLedger,
    details: `Entries: ${ledgerRes.data?.length}`,
  });

  // TC-XP-003: Management can view any student's XP
  const adminViewStudentXp = await request('GET', `/users/${studentUser.id}/xp?year=2026`, null, adminToken);
  recordTest({
    group: GROUP,
    name: 'TC-XP-003: Katalyst Management can view any student XP',
    res: adminViewStudentXp,
    passed: adminViewStudentXp.status === 200,
  });

  // TC-XP-004: Student cannot view another user's XP
  const fakeUserId = '00000000-0000-0000-0000-000000000000';
  const studentViewOther = await request('GET', `/users/${fakeUserId}/xp`, null, studentToken);
  recordTest({
    group: GROUP,
    name: 'TC-XP-004: Student attempting to view another user XP gets 403 Forbidden',
    res: studentViewOther,
    passed: studentViewOther.status === 403,
  });
}

module.exports = runXpTests;
