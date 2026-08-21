/**
 * Master Test Suite Runner for Katalyst Gamification Platform.
 * Executes all 7 feature-group test suites across PRD functional requirements
 * and automatically logs all request bodies, types, and response JSONs to file.
 */
const { startServer, stopServer, saveTestReports } = require('./testHelper');
const runAuthTests = require('./auth.test');
const runModulesTests = require('./modules.test');
const runEnrollmentsTests = require('./enrollments.test');
const runSubmissionsTests = require('./submissions.test');
const runXpTests = require('./xp.test');
const runReportsTests = require('./reports.test');
const runAiCoachTests = require('./aiCoach.test');

async function main() {
  console.log(`================================================================`);
  console.log(`🧪 Katalyst Gamification — Comprehensive PRD Test Runner`);
  console.log(`================================================================`);

  const { baseUrl } = await startServer();
  console.log(`Connected to test environment at: ${baseUrl}`);

  try {
    await runAuthTests();
    await runModulesTests();
    await runEnrollmentsTests();
    await runSubmissionsTests();
    await runXpTests();
    await runReportsTests();
    await runAiCoachTests();
  } finally {
    stopServer();
  }

  // Generate and save test report files
  const { jsonFilePath, logFilePath, total, passed, failed, passRate } = saveTestReports();

  console.log(`\n================================================================`);
  console.log(`📊 FINAL TEST EXECUTION SUMMARY`);
  console.log(`================================================================`);
  console.log(`Total Test Cases Executed : ${total}`);
  console.log(`Passed                    : ${passed} ✅`);
  console.log(`Failed                    : ${failed} ${failed > 0 ? '❌' : '🎉'}`);
  console.log(`Overall Pass Rate         : ${passRate}%`);
  console.log(`----------------------------------------------------------------`);
  console.log(`📄 Detailed JSON Log      : ${jsonFilePath}`);
  console.log(`📄 Formatted Text/MD Log  : ${logFilePath}`);
  console.log(`================================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  stopServer();
  process.exit(1);
});
