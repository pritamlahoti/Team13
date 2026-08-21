// FR021 — achievements are derived from existing xp_ledger/submission data
// rather than stored in their own table: no fixed catalogue exists yet
// (main PRD open question), and computing on read means new rules can be
// added here without a migration. Add a persisted "earned_at" table if the
// product later needs "achievement unlocked" notifications at the moment of
// earning rather than on next read.
const RULES = [
  { id: 'first_submission', name: 'First Steps', description: 'Complete your first scored activity', check: (s) => s.submissionCount >= 1 },
  { id: 'five_submissions', name: 'Getting Started', description: 'Complete 5 scored activities', check: (s) => s.submissionCount >= 5 },
  { id: 'ten_submissions', name: 'Consistent Contributor', description: 'Complete 10 scored activities', check: (s) => s.submissionCount >= 10 },
  { id: 'xp_100', name: 'Century Club', description: 'Earn 100 XP', check: (s) => s.totalXp >= 100 },
  { id: 'xp_500', name: 'High Achiever', description: 'Earn 500 XP', check: (s) => s.totalXp >= 500 },
  { id: 'xp_1000', name: 'XP Master', description: 'Earn 1000 XP', check: (s) => s.totalXp >= 1000 },
  { id: 'project_finisher', name: 'Project Finisher', description: 'Complete a project activity', check: (s) => s.projectCount >= 1 },
  { id: 'well_rounded', name: 'Well Rounded', description: 'Complete activities across 5 different modules', check: (s) => s.distinctModuleCount >= 5 },
];

module.exports = RULES;
