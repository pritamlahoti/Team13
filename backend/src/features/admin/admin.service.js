const adminRepo = require('./admin.repo');

async function getDashboardData() {
  const stats = await adminRepo.getDashboardStats();
  
  // You might want to calculate completion/engagement rate based on existing logic 
  // or simple ratios. For now, defaulting to placeholder values for complex metrics
  // as per the requirement to provide structure.
  
  return {
    students: {
      total: stats.studentsTotal,
      active: stats.studentsActive,
      inactive: stats.studentsInactive
    },
    mentors: {
      total: stats.mentorsTotal
    },
    activities: {
      total: stats.activitiesTotal,
      active: stats.activitiesActive,
      overdue: stats.activitiesOverdue
    },
    engagement: {
      rate: 0 // TODO: Calculate based on active students vs total students or engagement_events
    },
    completion: {
      rate: 0 // TODO: Calculate based on submissions vs enrollments
    },
    xp: {
      total: stats.totalXp
    }
  };
}

function listActivities() {
  return adminRepo.listActivities();
}

function getActivity(id) {
  return adminRepo.getActivity(id);
}

function createActivity(data, createdBy) {
  // Validate basic required fields
  if (!data.title) throw new Error('Title is required');
  if (!data.type_name) throw new Error('Activity type is required');
  if (data.start_date && data.due_date && new Date(data.due_date) < new Date(data.start_date)) {
    throw new Error('Due date cannot be before start date');
  }

  return adminRepo.createActivity(data, createdBy);
}

function updateActivity(id, data) {
  if (data.start_date && data.due_date && new Date(data.due_date) < new Date(data.start_date)) {
    throw new Error('Due date cannot be before start date');
  }
  return adminRepo.updateActivity(id, data);
}

function updateActivityStatus(id, status) {
  return adminRepo.updateActivityStatus(id, status);
}

function listStudents(filters) {
  return adminRepo.listStudents(filters);
}

function getStudent(id) {
  return adminRepo.getStudent(id);
}

function getStudentProgress(id) {
  return adminRepo.getStudentProgress(id);
}

function listMentors() {
  return adminRepo.listMentors();
}

function getMentor(id) {
  return adminRepo.getMentor(id);
}

function getMentorStudents(id) {
  return adminRepo.getMentorStudents(id);
}

function assignMentor(mentorId, studentId) {
  return adminRepo.assignMentor(mentorId, studentId);
}

function removeMentorAssignment(mentorId, studentId) {
  return adminRepo.removeMentorAssignment(mentorId, studentId);
}

function getXpRules() {
  return adminRepo.getXpRules();
}

function updateXpRules(rules) {
  return adminRepo.updateXpRules(rules);
}

function getAnalyticsOverview(filters) {
  return adminRepo.getAnalyticsOverview(filters);
}

function getAtRiskStudents() {
  return adminRepo.getAtRiskStudents();
}

const reportsService = require('../reports/reports.service');
function generateAdminReport(filters) {
  return reportsService.generateReport(filters);
}

module.exports = {
  getDashboardData,
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  updateActivityStatus,
  listStudents,
  getStudent,
  getStudentProgress,
  listMentors,
  getMentor,
  getMentorStudents,
  assignMentor,
  removeMentorAssignment,
  getXpRules,
  updateXpRules,
  getAnalyticsOverview,
  getAtRiskStudents,
  generateAdminReport
};
