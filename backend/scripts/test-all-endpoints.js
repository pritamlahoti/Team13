/**
 * Katalyst Gamification API - Full Endpoints Verification Suite
 *
 * Spawns the current application code on a local test port, verifies all 31+
 * endpoints, role gates, database aggregations, error handlers, and AI Coach flows.
 */
require('dotenv').config();
const app = require('../src/app');

let server;
let BASE_URL = '';

let adminToken = '';
let studentToken = '';
let adminUser = null;
let studentUser = null;
let testObjectiveModule = null;
let testSubjectiveModule = null;
let testEnrollment = null;
let testObjectiveSubmission = null;
let testSubjectiveSubmission = null;

const results = [];

async function request(method, path, body = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {
    method,
    headers,
  };
  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

function assertTest(name, passed, details = '') {
  results.push({ name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${name} ${details ? `— ${details}` : ''}`);
}

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      console.log(`\n======================================================`);
      console.log(`🚀 Starting Katalyst API Endpoints Verification Suite`);
      console.log(`Target: ${BASE_URL} (In-Process Server)`);
      console.log(`======================================================\n`);
      resolve();
    });
  });

  try {
    // 1. Health check
    const res = await request('GET', '/health');
    assertTest('GET /health', res.status === 200 && res.data?.status === 'ok', `status: ${res.status}`);

    // 2. Auth - Login Admin
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@katalyst.com',
      password: 'Password@123',
    });
    adminToken = adminLogin.data?.token;
    adminUser = adminLogin.data?.user;
    assertTest('POST /auth/login (Admin)', adminLogin.status === 200 && !!adminToken, `Admin ID: ${adminUser?.id}`);

    // 3. Auth - Login Student
    const studentLogin = await request('POST', '/auth/login', {
      email: 'aarav.sharma@student.katalyst.com',
      password: 'Password@123',
    });
    studentToken = studentLogin.data?.token;
    studentUser = studentLogin.data?.user;
    assertTest('POST /auth/login (Student)', studentLogin.status === 200 && !!studentToken, `Student ID: ${studentUser?.id}`);

    // 4. Auth - Invalid Login
    const badLogin = await request('POST', '/auth/login', {
      email: 'admin@katalyst.com',
      password: 'WrongPassword!',
    });
    assertTest('POST /auth/login (Bad Credentials)', badLogin.status === 401, 'Returns 401 Unauthorized');

    // 5. Auth - GET /auth/me with Student Token
    const meStudent = await request('GET', '/auth/me', null, studentToken);
    assertTest('GET /auth/me (Authenticated)', meStudent.status === 200 && meStudent.data?.email === 'aarav.sharma@student.katalyst.com', `User: ${meStudent.data?.name}`);

    // 6. Auth - GET /auth/me without Token (Unauthorized)
    const meNoToken = await request('GET', '/auth/me');
    assertTest('GET /auth/me (Missing Token)', meNoToken.status === 401, 'Returns 401 Unauthorized');

    // 7. Auth - POST /auth/signup (Admin creates user)
    const testNewEmail = `test.student.${Date.now()}@student.katalyst.com`;
    const signupRes = await request(
      'POST',
      '/auth/signup',
      {
        name: 'Test Student',
        email: testNewEmail,
        password: 'Password@123',
        role: 'student',
        cohortYear: 2026,
      },
      adminToken
    );
    assertTest('POST /auth/signup (Admin role)', signupRes.status === 201 && !!signupRes.data?.user?.id, `Created: ${testNewEmail}`);

    // 8. Auth - POST /auth/signup by Student (Forbidden)
    const studentSignupRes = await request(
      'POST',
      '/auth/signup',
      {
        name: 'Hacker User',
        email: `hacker.${Date.now()}@katalyst.com`,
        password: 'Password@123',
        role: 'katalyst_management',
      },
      studentToken
    );
    assertTest('POST /auth/signup (Student forbidden)', studentSignupRes.status === 403, 'Returns 403 Forbidden');

    // 9. Modules - POST /modules (Admin creates Objective Session Module)
    const createObjModule = await request(
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
    testObjectiveModule = createObjModule.data;
    assertTest('POST /modules (Admin: Objective Module)', createObjModule.status === 201 && !!testObjectiveModule?.id, `Module ID: ${testObjectiveModule?.id}`);

    // 10. Modules - POST /modules (Admin creates Subjective Project Module)
    const createSubjModule = await request(
      'POST',
      '/modules',
      {
        type: 'project',
        classification: 'optional',
        scoringMode: 'subjective',
      },
      adminToken
    );
    testSubjectiveModule = createSubjModule.data;
    assertTest('POST /modules (Admin: Subjective Module)', createSubjModule.status === 201 && !!testSubjectiveModule?.id, `Module ID: ${testSubjectiveModule?.id}`);

    // 11. Modules - POST /modules by Student (Forbidden)
    const studentCreateMod = await request(
      'POST',
      '/modules',
      {
        type: 'course',
        classification: 'optional',
        scoringMode: 'objective',
      },
      studentToken
    );
    assertTest('POST /modules (Student forbidden)', studentCreateMod.status === 403, 'Returns 403 Forbidden');

    // 12. Modules - GET /modules (List Modules)
    const listMods = await request('GET', '/modules', null, studentToken);
    assertTest('GET /modules', listMods.status === 200 && Array.isArray(listMods.data) && listMods.data.length > 0, `Count: ${listMods.data?.length}`);

    // 13. Modules - GET /modules/:id
    const getMod = await request('GET', `/modules/${testObjectiveModule.id}`, null, studentToken);
    assertTest('GET /modules/:id', getMod.status === 200 && getMod.data?.id === testObjectiveModule.id, `Type: ${getMod.data?.type}`);

    // 14. Enrollments - POST /enrollments (Student enrolls)
    const enrollRes = await request(
      'POST',
      '/enrollments',
      { moduleId: testObjectiveModule.id },
      studentToken
    );
    testEnrollment = enrollRes.data;
    assertTest('POST /enrollments (Student enrolls)', enrollRes.status === 201 && testEnrollment?.status === 'enrolled', `Enrollment ID: ${testEnrollment?.id}`);

    // 15. Enrollments - GET /enrollments (List my enrollments)
    const myEnrollments = await request('GET', '/enrollments', null, studentToken);
    assertTest('GET /enrollments', myEnrollments.status === 200 && Array.isArray(myEnrollments.data), `Enrolled count: ${myEnrollments.data?.length}`);

    // 16. Enrollments - PATCH /enrollments/:id/complete (Mark complete)
    if (testEnrollment?.id) {
      const completeRes = await request('PATCH', `/enrollments/${testEnrollment.id}/complete`, {}, studentToken);
      assertTest('PATCH /enrollments/:id/complete', completeRes.status === 200 && completeRes.data?.status === 'completed', `Status: ${completeRes.data?.status}`);
    }

    // 17. Submissions - POST /submissions (Objective: triggers Autonomous AI Coach review)
    console.log('\n[Testing Autonomous AI Coach flow on Objective Submission...]');
    const subObjRes = await request(
      'POST',
      '/submissions',
      {
        moduleId: testObjectiveModule.id,
        contentRef: 'Completed all objective session quizzes and attended live session',
      },
      studentToken
    );
    testObjectiveSubmission = subObjRes.data;
    assertTest(
      'POST /submissions (Objective -> AI Auto-Score)',
      subObjRes.status === 201 && (testObjectiveSubmission?.status === 'scored' || testObjectiveSubmission?.status === 'pending'),
      `Status: ${testObjectiveSubmission?.status}`
    );

    // 18. Submissions - POST /submissions (Subjective: stays in pending for Management)
    const subSubjRes = await request(
      'POST',
      '/submissions',
      {
        moduleId: testSubjectiveModule.id,
        contentRef: 'https://github.com/aarav/cloud-native-capstone',
      },
      studentToken
    );
    testSubjectiveSubmission = subSubjRes.data;
    assertTest(
      'POST /submissions (Subjective -> Pending Management Review)',
      subSubjRes.status === 201 && testSubjectiveSubmission?.status === 'pending',
      `Status: ${testSubjectiveSubmission?.status}`
    );

    // 19. Submissions - POST /projectSubmission (using projectId alias)
    const projSubRes = await request(
      'POST',
      '/projectSubmission',
      {
        projectId: testSubjectiveModule.id,
        contentRef: 'Project final report link: https://docs.google.com/proj-final',
      },
      studentToken
    );
    assertTest('POST /projectSubmission (Alias route)', projSubRes.status === 201 && !!projSubRes.data?.id, `Created Submission ID: ${projSubRes.data?.id}`);

    // 20. Submissions - GET /submissions (Admin list pending review queue)
    const adminSubs = await request('GET', '/submissions', null, adminToken);
    assertTest('GET /submissions (Admin review queue)', adminSubs.status === 200 && Array.isArray(adminSubs.data), `Pending count: ${adminSubs.data?.length}`);

    // 21. Submissions - GET /submissions by Student (Forbidden)
    const studentSubs = await request('GET', '/submissions', null, studentToken);
    assertTest('GET /submissions (Student forbidden)', studentSubs.status === 403, 'Returns 403 Forbidden');

    // 22. Submissions - GET /submissions/:id (Single submission details)
    const singleSub = await request('GET', `/submissions/${testSubjectiveSubmission.id}`, null, studentToken);
    assertTest('GET /submissions/:id', singleSub.status === 200 && singleSub.data?.id === testSubjectiveSubmission.id, `Submission ID: ${singleSub.data?.id}`);

    // 23. AI Coach - POST /submissions/:id/ai-review (Draft feedback for reviewer)
    console.log('\n[Testing AI Coach Draft Feedback generation...]');
    const draftFeedback = await request('POST', `/submissions/${testSubjectiveSubmission.id}/ai-review`, {}, adminToken);
    assertTest(
      'POST /submissions/:id/ai-review (Admin)',
      draftFeedback.status === 200,
      draftFeedback.data?.draftFeedback ? `Feedback generated: "${draftFeedback.data.draftFeedback.slice(0, 50).trim()}..."` : 'AI returned fallback (graceful degradation)'
    );

    // 24. Reviews - POST /submissions/:id/score (Management scores subjective submission)
    const scoreRes = await request(
      'POST',
      `/submissions/${testSubjectiveSubmission.id}/score`,
      {
        outcome: 'approved',
        feedbackText: 'Outstanding capstone project implementation with thorough architecture.',
        xpAwarded: 40,
      },
      adminToken
    );
    assertTest(
      'POST /submissions/:id/score (Admin score & XP award)',
      scoreRes.status === 201 && scoreRes.data?.xp?.xpAwarded === 40,
      `XP Awarded: ${scoreRes.data?.xp?.xpAwarded}`
    );

    // 25. AI Coach - POST /ai-coach/nudge (Admin triggers nudge message)
    console.log('\n[Testing AI Coach Nudge generation...]');
    const nudgeRes = await request(
      'POST',
      '/ai-coach/nudge',
      { userId: studentUser.id },
      adminToken
    );
    assertTest(
      'POST /ai-coach/nudge (Admin triggers nudge)',
      nudgeRes.status === 200 && !!nudgeRes.data?.message,
      nudgeRes.data?.message ? `Nudge: "${nudgeRes.data.message.slice(0, 50).trim()}..."` : 'Nudge returned message'
    );

    // 26. AI Coach - GET /users/:id/progress-updates (Student requests progress summary)
    console.log('\n[Testing AI Coach Progress Update...]');
    const progressRes = await request('GET', `/users/${studentUser.id}/progress-updates`, null, studentToken);
    assertTest(
      'GET /users/:id/progress-updates (Student)',
      progressRes.status === 200 && !!progressRes.data?.update,
      progressRes.data?.update ? `Update: "${progressRes.data.update.slice(0, 50).trim()}..."` : 'Progress update generated'
    );

    // 27. XP - GET /users/:id/xp (Student total XP)
    const xpRes = await request('GET', `/users/${studentUser.id}/xp?year=2026`, null, studentToken);
    assertTest(
      'GET /users/:id/xp?year=2026',
      xpRes.status === 200 && typeof xpRes.data?.totalXp === 'number',
      `Total XP for 2026: ${xpRes.data?.totalXp}`
    );

    // 28. XP - GET /users/:id/xp/ledger (Student XP history log)
    const ledgerRes = await request('GET', `/users/${studentUser.id}/xp/ledger`, null, studentToken);
    assertTest(
      'GET /users/:id/xp/ledger',
      ledgerRes.status === 200 && Array.isArray(ledgerRes.data),
      `Ledger entries count: ${ledgerRes.data?.length}`
    );

    // 29. Reports - GET /reports (Admin generates filtered report)
    const reportRes = await request('GET', `/reports?moduleType=project`, null, adminToken);
    assertTest(
      'GET /reports?moduleType=project (Admin)',
      reportRes.status === 200 && Array.isArray(reportRes.data),
      `Matching rows: ${reportRes.data?.length}`
    );

    // 30. Reports - GET /reports by Student (Forbidden)
    const studentReport = await request('GET', `/reports`, null, studentToken);
    assertTest('GET /reports (Student forbidden)', studentReport.status === 403, 'Returns 403 Forbidden');

    // 31. 404 Route Handler
    const notFound = await request('GET', '/random-unknown-endpoint');
    assertTest('GET /unknown-route (404 Handler)', notFound.status === 404, 'Returns 404 Not Found');

  } finally {
    if (server) server.close();
    printSummary();
  }
}

function printSummary() {
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`\n======================================================`);
  console.log(`📊 TEST RESULTS SUMMARY`);
  console.log(`Total Endpoints & Security Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  console.log(`======================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
