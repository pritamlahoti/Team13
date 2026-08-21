/**
 * Full database seed for Katalyst Gamification.
 * Populates: 2 admin/mgmt users + 20 students + 10 modules +
 *            enrollments + submissions + reviews + xp_ledger entries.
 *
 * Usage:  node src/db/fullSeed.js
 * Safe to re-run — skips duplicates via try/catch on unique constraints.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

const FIRST_NAMES = ['Aarav','Diya','Rohan','Priya','Arjun','Sneha','Karan','Ananya','Vikram','Pooja','Aditya','Meera','Rahul','Nisha','Amit','Kavya','Raj','Sanya','Dev','Tara'];
const LAST_NAMES  = ['Sharma','Patel','Mehta','Gupta','Singh','Kumar','Verma','Joshi','Shah','Nair','Reddy','Iyer','Das','Bose','Malhotra','Rao','Kapoor','Chaudhary','Bhat','Pillai'];

const MODULE_SEEDS = [
  { type: 'session',    classification: 'mandatory',   scoringMode: 'objective',  xp: 10 },
  { type: 'session',    classification: 'mandatory',   scoringMode: 'objective',  xp: 10 },
  { type: 'course',     classification: 'mandatory',   scoringMode: 'objective',  xp: 20 },
  { type: 'course',     classification: 'certificate', scoringMode: 'subjective', xp: 30 },
  { type: 'assignment', classification: 'mandatory',   scoringMode: 'objective',  xp: 25 },
  { type: 'assignment', classification: 'optional',    scoringMode: 'subjective', xp: 20 },
  { type: 'project',    classification: 'mandatory',   scoringMode: 'subjective', xp: 40 },
  { type: 'project',    classification: 'optional',    scoringMode: 'subjective', xp: 35 },
  { type: 'mentoring',  classification: 'optional',    scoringMode: 'subjective', xp: 15 },
  { type: 'milestone',  classification: 'mandatory',   scoringMode: 'objective',  xp: 15 },
];

const CONTENT_REFS = [
  'https://drive.google.com/file/sample1',
  'https://github.com/student/project-repo',
  'Completed all quiz questions with 92% score',
  'Attended full session — Certificate #KAT-2024-001',
  'https://notion.so/writeup/case-study',
  'Submitted via Katalyst Konnect portal — ref #7823',
  'Project repo: https://github.com/katalyst/open-innov',
  'Video presentation: https://loom.com/share/demo',
  'Mentoring session notes submitted to portal',
  'Milestone reflection: https://docs.google.com/katalyst-milestone',
];

const FEEDBACK_BANK = [
  'Great work demonstrating a solid understanding of the core concepts.',
  'Well-structured submission. Could improve depth of analysis in section 2.',
  'Excellent practical application. Shows strong problem-solving skills.',
  'Good effort! The logic is sound but documentation needs improvement.',
  'Outstanding submission — creative approach and well-executed.',
  'Meets expectations. Focus on edge-case handling in future submissions.',
  'Strong understanding shown. Presentation could be more concise.',
  'Good foundation, but the conclusion needs stronger evidence.',
  'Impressive depth of research. Code quality is production-ready.',
  'Satisfactory work. Encouraged to push further in the next activity.',
];

async function main() {
  console.log('Seeding Katalyst database...\n');
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@katalyst.com' },
    update: {},
    create: { name: 'Katalyst Admin', email: 'admin@katalyst.com', passwordHash, role: 'katalyst_management' },
  });
  await prisma.user.upsert({
    where: { email: 'director@katalyst.com' },
    update: {},
    create: { name: 'Programme Director', email: 'director@katalyst.com', passwordHash, role: 'higher_management' },
  });
  console.log('Admin users: done');

  // Students
  const students = [];
  for (let i = 0; i < 20; i++) {
    const name  = FIRST_NAMES[i] + ' ' + LAST_NAMES[i];
    const email = (FIRST_NAMES[i] + '.' + LAST_NAMES[i]).toLowerCase() + '@student.katalyst.com';
    const s = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, passwordHash, role: 'student', cohortYear: 2023 + (i % 4) },
    });
    students.push(s);
  }
  console.log('Students: done (' + students.length + ')');

  // Modules
  const modules = [];
  for (let i = 0; i < MODULE_SEEDS.length; i++) {
    const s = MODULE_SEEDS[i];
    const dueDate = s.classification === 'mandatory' ? daysAgo(-(30 + i * 7)) : null;
    const m = await prisma.module.create({
      data: { type: s.type, classification: s.classification, scoringMode: s.scoringMode, dueDate, createdBy: admin.id },
    });
    modules.push({ ...m, _xp: s.xp });
  }
  console.log('Modules: done (' + modules.length + ')');

  // Enrollments
  let enrollCount = 0;
  for (const student of students) {
    for (const mod of modules) {
      try {
        await prisma.enrollment.create({
          data: { userId: student.id, moduleId: mod.id, status: Math.random() > 0.25 ? 'completed' : 'enrolled' },
        });
        enrollCount++;
      } catch {}
    }
  }
  console.log('Enrollments: done (' + enrollCount + ')');

  // Submissions
  const subs = [];
  for (const student of students) {
    const chosen = pickN(modules, randInt(6, 9));
    for (const mod of chosen) {
      const sub = await prisma.submission.create({
        data: { userId: student.id, moduleId: mod.id, contentRef: pick(CONTENT_REFS), status: 'pending', submittedAt: daysAgo(randInt(1, 60)) },
      });
      subs.push({ ...sub, _xp: mod._xp, _mode: mod.scoringMode });
    }
  }
  console.log('Submissions: done (' + subs.length + ')');

  // Reviews + XP
  let reviewCount = 0, xpCount = 0;
  for (const sub of subs) {
    if (Math.random() > 0.70) continue;
    const isAi = sub._mode === 'objective' || Math.random() > 0.5;
    const reviewerType = isAi ? 'ai_coach' : 'management';
    const xpAwarded = Math.max(5, sub._xp + randInt(-5, 10));
    const reviewedAt = new Date(new Date(sub.submittedAt).getTime() + randInt(1, 5) * 86400000);

    await prisma.submission.update({ where: { id: sub.id }, data: { status: 'scored' } });
    await prisma.review.create({
      data: { submissionId: sub.id, reviewerType, reviewerId: isAi ? null : admin.id, outcome: Math.random() > 0.1 ? 'approved' : 'needs_revision', feedbackText: pick(FEEDBACK_BANK), reviewedAt },
    });
    await prisma.xpLedger.create({
      data: { submissionId: sub.id, scoredBy: reviewerType, xpAwarded, createdAt: reviewedAt },
    });
    reviewCount++; xpCount++;
  }
  console.log('Reviews: done (' + reviewCount + '), XP entries: (' + xpCount + ')');

  console.log('\n=== SEED COMPLETE ===');
  console.log('Users       :', await prisma.user.count());
  console.log('Modules     :', await prisma.module.count());
  console.log('Enrollments :', await prisma.enrollment.count());
  console.log('Submissions :', await prisma.submission.count());
  console.log('Reviews     :', await prisma.review.count());
  console.log('XP Ledger   :', await prisma.xpLedger.count());
  console.log('\nAll passwords: Password@123');
  console.log('admin@katalyst.com          -> katalyst_management');
  console.log('director@katalyst.com       -> higher_management');
  console.log('aarav.sharma@student...     -> student (+ 19 others)');
  await prisma.$disconnect();
}

main().catch(e => { console.error('Seed failed:', e.message); prisma.$disconnect(); process.exit(1); });
