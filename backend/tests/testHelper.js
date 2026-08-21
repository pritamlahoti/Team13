/**
 * Shared Test Helper for Katalyst Test Suite.
 * Handles server lifecycle, HTTP dispatch, token caching,
 * and comprehensive file logging of request types, bodies, response JSONs, and statistics.
 */
process.env.NODE_ENV = 'test';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

let server = null;
let baseUrl = '';
let cachedTokens = null;

// Audit log stores all executed test cases with full request/response payloads
const testAuditLog = [];

async function startServer() {
  if (server) return { server, baseUrl };
  try {
    await prisma.$connect();
  } catch {}
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve({ server, baseUrl });
    });
  });
}

function stopServer() {
  if (server) {
    server.close();
    server = null;
  }
}

function resolveTokenType(token) {
  if (!token) return 'None (Unauthenticated)';
  if (cachedTokens) {
    if (token === cachedTokens.adminToken) return 'Bearer (Katalyst Management / Admin)';
    if (token === cachedTokens.studentToken) return 'Bearer (Student)';
    if (token === cachedTokens.directorToken) return 'Bearer (Higher Management / Director)';
  }
  return 'Bearer (Custom / Token)';
}

async function request(method, path, body = null, token = null) {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const startTime = Date.now();
  try {
    const res = await fetch(url, options);
    const durationMs = Date.now() - startTime;
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return {
      status: res.status,
      ok: res.ok,
      data,
      durationMs,
      req: {
        method,
        path,
        body,
        tokenType: resolveTokenType(token),
      },
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    return {
      status: 0,
      ok: false,
      error: err.message,
      data: { error: err.message },
      durationMs,
      req: {
        method,
        path,
        body,
        tokenType: resolveTokenType(token),
      },
    };
  }
}

function recordTest({ group, name, res, passed, details = '' }) {
  const entry = {
    group,
    name,
    passed: !!passed,
    details: details || '',
    executedAt: new Date().toISOString(),
    request: {
      type: res?.req?.method || 'UNKNOWN',
      endpoint: res?.req?.path || '',
      auth: res?.req?.tokenType || 'None',
      body: res?.req?.body || null,
    },
    response: {
      statusCode: res?.status ?? 0,
      durationMs: res?.durationMs ?? 0,
      json: res?.data ?? null,
    },
  };

  testAuditLog.push(entry);

  const icon = passed ? '  ✅' : '  ❌';
  console.log(`${icon} ${name} ${details ? `(${details})` : ''}`);
  return entry;
}

async function getAuthTokens() {
  if (cachedTokens) return cachedTokens;

  const adminRes = await request('POST', '/auth/login', {
    email: 'admin@katalyst.com',
    password: 'Password@123',
  });
  const studentRes = await request('POST', '/auth/login', {
    email: 'aarav.sharma@student.katalyst.com',
    password: 'Password@123',
  });
  const directorRes = await request('POST', '/auth/login', {
    email: 'director@katalyst.com',
    password: 'Password@123',
  });

  cachedTokens = {
    adminToken: adminRes.data?.token,
    adminUser: adminRes.data?.user,
    studentToken: studentRes.data?.token,
    studentUser: studentRes.data?.user,
    directorToken: directorRes.data?.token,
    directorUser: directorRes.data?.user,
  };

  return cachedTokens;
}

function saveTestReports(jsonFileName = 'test-results.json', logFileName = 'test-results.log') {
  const total = testAuditLog.length;
  const passed = testAuditLog.filter((t) => t.passed).length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  const groupMap = {};
  for (const t of testAuditLog) {
    if (!groupMap[t.group]) groupMap[t.group] = { total: 0, passed: 0, failed: 0, items: [] };
    groupMap[t.group].total++;
    if (t.passed) groupMap[t.group].passed++;
    else groupMap[t.group].failed++;
    groupMap[t.group].items.push(t);
  }

  const jsonReport = {
    summary: {
      generatedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'test',
      baseUrl,
      totalTestCases: total,
      passedCount: passed,
      failedCount: failed,
      passRate: `${passRate}%`,
    },
    groupStatistics: Object.keys(groupMap).map((grp) => ({
      group: grp,
      total: groupMap[grp].total,
      passed: groupMap[grp].passed,
      failed: groupMap[grp].failed,
      passRate: `${((groupMap[grp].passed / groupMap[grp].total) * 100).toFixed(1)}%`,
    })),
    testCases: testAuditLog,
  };

  // 1. Write JSON Report
  const jsonFilePath = path.join(__dirname, jsonFileName);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonReport, null, 2), 'utf-8');

  // 2. Write Human-Readable Log Report
  let logContent = `================================================================================\n`;
  logContent += `🧪 KATALYST GAMIFICATION PLATFORM — AUTOMATED TEST EXECUTION LOG\n`;
  logContent += `================================================================================\n`;
  logContent += `Execution Time : ${new Date().toISOString()}\n`;
  logContent += `Base URL       : ${baseUrl}\n`;
  logContent += `Environment    : ${process.env.NODE_ENV || 'test'}\n`;
  logContent += `--------------------------------------------------------------------------------\n`;
  logContent += `📊 SUMMARY STATISTICS\n`;
  logContent += `--------------------------------------------------------------------------------\n`;
  logContent += `Total Tests Executed : ${total}\n`;
  logContent += `Passed               : ${passed} ✅\n`;
  logContent += `Failed               : ${failed} ${failed > 0 ? '❌' : '🎉'}\n`;
  logContent += `Pass Rate            : ${passRate}%\n\n`;

  logContent += `--------------------------------------------------------------------------------\n`;
  logContent += `📁 GROUP-BY-GROUP BREAKDOWN\n`;
  logContent += `--------------------------------------------------------------------------------\n`;
  for (const grp of Object.keys(groupMap)) {
    const g = groupMap[grp];
    logContent += `• [${grp}] - ${g.passed}/${g.total} Passed (${((g.passed / g.total) * 100).toFixed(1)}%)\n`;
  }
  logContent += `\n================================================================================\n`;
  logContent += `📝 DETAILED REQUEST & RESPONSE AUDIT LOG\n`;
  logContent += `================================================================================\n\n`;

  for (let i = 0; i < testAuditLog.length; i++) {
    const t = testAuditLog[i];
    const statusIcon = t.passed ? '[PASS] ✅' : '[FAIL] ❌';
    logContent += `--------------------------------------------------------------------------------\n`;
    logContent += `[#${i + 1}] ${statusIcon} ${t.name}\n`;
    logContent += `Group            : ${t.group}\n`;
    logContent += `Executed At      : ${t.executedAt}\n`;
    logContent += `Request Type     : ${t.request.type}\n`;
    logContent += `Endpoint         : ${t.request.endpoint}\n`;
    logContent += `Auth Context     : ${t.request.auth}\n`;
    logContent += `Request Body     :\n${t.request.body ? JSON.stringify(t.request.body, null, 2) : '  (None)'}\n`;
    logContent += `Response Status  : ${t.response.statusCode} (Latency: ${t.response.durationMs}ms)\n`;
    logContent += `Response JSON    :\n${t.response.json ? JSON.stringify(t.response.json, null, 2) : '  (None)'}\n`;
    if (t.details) {
      logContent += `Details / Notes  : ${t.details}\n`;
    }
    logContent += `\n`;
  }

  logContent += `================================================================================\n`;
  logContent += `🏁 END OF TEST LOG REPORT\n`;
  logContent += `================================================================================\n`;

  const logFilePath = path.join(__dirname, logFileName);
  fs.writeFileSync(logFilePath, logContent, 'utf-8');

  return { jsonFilePath, logFilePath, total, passed, failed, passRate };
}

module.exports = {
  startServer,
  stopServer,
  request,
  recordTest,
  getAuthTokens,
  saveTestReports,
  testAuditLog,
};
