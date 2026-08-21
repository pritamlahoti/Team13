const { request, recordTest, getAuthTokens } = require('./testHelper');

const GROUP = 'Group 1: Authentication & Authorization';

async function runAuthTests() {
  console.log(`\n--- [${GROUP}] ---`);

  // TC-AUTH-001: Valid Login
  const loginRes = await request('POST', '/auth/login', {
    email: 'admin@katalyst.com',
    password: 'Password@123',
  });
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-001: Valid login returns JWT and user payload',
    res: loginRes,
    passed: loginRes.status === 200 && !!loginRes.data?.token,
  });

  // TC-AUTH-002: Invalid Password
  const badLogin = await request('POST', '/auth/login', {
    email: 'admin@katalyst.com',
    password: 'WrongPassword!',
  });
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-002: Invalid password returns 401 Unauthorized',
    res: badLogin,
    passed: badLogin.status === 401,
  });

  // TC-AUTH-003: Missing Token
  const noToken = await request('GET', '/auth/me');
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-003: Missing Authorization header returns 401',
    res: noToken,
    passed: noToken.status === 401,
  });

  // TC-AUTH-004: Invalid/Malformed Token
  const badToken = await request('GET', '/auth/me', null, 'invalid.jwt.token');
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-004: Malformed JWT token returns 401',
    res: badToken,
    passed: badToken.status === 401,
  });

  const { adminToken, studentToken } = await getAuthTokens();

  // TC-AUTH-005: Admin can signup user
  const newEmail = `qa.student.${Date.now()}@student.katalyst.com`;
  const signupRes = await request(
    'POST',
    '/auth/signup',
    {
      name: 'QA Student',
      email: newEmail,
      password: 'Password@123',
      role: 'student',
      cohortYear: 2026,
    },
    adminToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-005: Katalyst Management can signup new accounts',
    res: signupRes,
    passed: signupRes.status === 201 && !!signupRes.data?.user?.id,
  });

  // TC-AUTH-006: Student cannot signup user
  const studentSignup = await request(
    'POST',
    '/auth/signup',
    {
      name: 'Hacker',
      email: `hacker.${Date.now()}@katalyst.com`,
      password: 'Password@123',
      role: 'katalyst_management',
    },
    studentToken
  );
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-006: Students attempting POST /auth/signup get 403 Forbidden',
    res: studentSignup,
    passed: studentSignup.status === 403,
  });

  // TC-AUTH-007: Safe profile fields
  const meRes = await request('GET', '/auth/me', null, studentToken);
  const hasNoPassword = meRes.data && !meRes.data.passwordHash && !meRes.data.password;
  recordTest({
    group: GROUP,
    name: 'TC-AUTH-007: GET /auth/me returns profile without password hash',
    res: meRes,
    passed: meRes.status === 200 && hasNoPassword,
  });
}

module.exports = runAuthTests;
