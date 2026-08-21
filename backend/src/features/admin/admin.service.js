const adminRepo = require('./admin.repo');
const { parsePagination, parseSort } = require('./admin.utils');

async function getDashboardData() {
  const stats = await adminRepo.getDashboardStats();
  
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
    xp: {
      total: stats.totalXp
    }
  };
}

function listActivities(query) {
  const { skip, take, page, limit } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'dueDate', 'type'], 'createdAt', 'desc');
  
  const where = {};
  if (query.search) {
    where.OR = [
      { type: { contains: query.search, mode: 'insensitive' } } // Assuming type can be searched if no title exists in schema
    ];
  }
  if (query.type) where.type = query.type;
  if (query.classification) where.classification = query.classification;
  if (query.scoringMode) where.scoringMode = query.scoringMode;
  
  if (query.from || query.to) {
    where.dueDate = {};
    if (query.from) where.dueDate.gte = new Date(query.from);
    if (query.to) where.dueDate.lte = new Date(query.to);
  }

  return adminRepo.listActivities(where, orderBy, skip, take).then(result => ({
    ...result,
    page, limit
  }));
}

function getActivity(id) {
  return adminRepo.getActivity(id);
}

function createActivity(data, createdBy) {
  if (!data.type) throw new Error('Module type is required');
  return adminRepo.createActivity(data, createdBy);
}

function updateActivity(id, data) {
  return adminRepo.updateActivity(id, data);
}

function updateActivityStatus(id, status) {
  return adminRepo.updateActivityStatus(id, status);
}

function listStudents(query) {
  const { skip, take, page, limit } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'name', 'email'], 'createdAt', 'desc');
  
  const where = { role: 'student' };
  
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  if (query.cohortYear) where.cohortYear = parseInt(query.cohortYear);

  return adminRepo.listStudents(where, orderBy, skip, take).then(result => ({
    ...result,
    page, limit
  }));
}

function getStudent(id) {
  return adminRepo.getStudent(id);
}

function getStudentProgress(id) {
  return adminRepo.getStudentProgress(id);
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
  getAnalyticsOverview,
  getAtRiskStudents,
  generateAdminReport
};
