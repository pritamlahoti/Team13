//Sakshi Nagare

const adminService = require('./admin.service');
const { formatPaginatedResponse, formatSuccessResponse } = require('./admin.utils');

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardData();
    res.json(formatSuccessResponse(data));
  } catch (err) {
    next(err);
  }
};

const listActivities = async (req, res, next) => {
  try {
    const { total, data, page, limit } = await adminService.listActivities(req.query);
    res.json(formatPaginatedResponse(data, total, { page, limit }));
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await adminService.createActivity(req.body, req.user.id);
    res.status(201).json(formatSuccessResponse(activity, 'Activity created successfully'));
  } catch (err) {
    next(err);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const activity = await adminService.getActivity(req.params.id);
    if (!activity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } });
    res.json(formatSuccessResponse(activity));
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const activity = await adminService.updateActivity(req.params.id, req.body);
    if (!activity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } });
    res.json(formatSuccessResponse(activity, 'Activity updated successfully'));
  } catch (err) {
    next(err);
  }
};

const updateActivityStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Status is required' } });
    const activity = await adminService.updateActivityStatus(req.params.id, status);
    if (!activity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } });
    res.json(formatSuccessResponse(activity, 'Status updated successfully'));
  } catch (err) {
    next(err);
  }
};

const listStudents = async (req, res, next) => {
  try {
    const { total, data, page, limit } = await adminService.listStudents(req.query);
    res.json(formatPaginatedResponse(data, total, { page, limit }));
  } catch (err) {
    next(err);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await adminService.getStudent(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Student not found' } });
    res.json(formatSuccessResponse(student));
  } catch (err) {
    next(err);
  }
};

const getStudentProgress = async (req, res, next) => {
  try {
    const progress = await adminService.getStudentProgress(req.params.id);
    res.json(formatSuccessResponse(progress));
  } catch (err) {
    next(err);
  }
};

const listMentors = async (req, res, next) => {
  try {
    const { total, data, page, limit } = await adminService.listMentors(req.query);
    res.json(formatPaginatedResponse(data, total, { page, limit }));
  } catch (err) {
    next(err);
  }
};

const getMentor = async (req, res, next) => {
  try {
    const mentor = await adminService.getMentor(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Mentor not found' } });
    res.json(formatSuccessResponse(mentor));
  } catch (err) {
    next(err);
  }
};

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsOverview(req.query);
    res.json(formatSuccessResponse(data));
  } catch (err) {
    next(err);
  }
};

const getAtRiskStudents = async (req, res, next) => {
  try {
    const atRisk = await adminService.getAtRiskStudents();
    res.json(formatSuccessResponse(atRisk));
  } catch (err) {
    next(err);
  }
};

const generateAdminReport = async (req, res, next) => {
  try {
    const report = await adminService.generateAdminReport(req.query);
    res.json(formatSuccessResponse(report));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  listActivities,
  createActivity,
  getActivity,
  updateActivity,
  updateActivityStatus,
  listStudents,
  getStudent,
  getStudentProgress,
  listMentors,
  getMentor,
  getAnalyticsOverview,
  getAtRiskStudents,
  generateAdminReport
};
