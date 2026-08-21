const adminService = require('./admin.service');

const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await adminService.getDashboardData();
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};

const listActivities = async (req, res, next) => {
  try {
    const activities = await adminService.listActivities();
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await adminService.createActivity(req.body, req.user.id);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const activity = await adminService.getActivity(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const activity = await adminService.updateActivity(req.params.id, req.body);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

const updateActivityStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const activity = await adminService.updateActivityStatus(req.params.id, status);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

const listStudents = async (req, res, next) => {
  try {
    const filters = req.query; // cohort, status, search
    const students = await adminService.listStudents(filters);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await adminService.getStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

const getStudentProgress = async (req, res, next) => {
  try {
    const progress = await adminService.getStudentProgress(req.params.id);
    res.json(progress);
  } catch (err) {
    next(err);
  }
};

const listMentors = async (req, res, next) => {
  try {
    const mentors = await adminService.listMentors();
    res.json(mentors);
  } catch (err) {
    next(err);
  }
};

const getMentor = async (req, res, next) => {
  try {
    const mentor = await adminService.getMentor(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json(mentor);
  } catch (err) {
    next(err);
  }
};

const getMentorStudents = async (req, res, next) => {
  try {
    const students = await adminService.getMentorStudents(req.params.id);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

const assignMentor = async (req, res, next) => {
  try {
    const { mentorId, studentId } = req.body;
    const assignment = await adminService.assignMentor(mentorId, studentId);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

const removeMentorAssignment = async (req, res, next) => {
  try {
    await adminService.removeMentorAssignment(req.params.mentorId, req.params.studentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getXpRules = async (req, res, next) => {
  try {
    const rules = await adminService.getXpRules();
    res.json(rules);
  } catch (err) {
    next(err);
  }
};

const updateXpRules = async (req, res, next) => {
  try {
    const rules = await adminService.updateXpRules(req.body);
    res.json(rules);
  } catch (err) {
    next(err);
  }
};

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsOverview(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getAtRiskStudents = async (req, res, next) => {
  try {
    const atRisk = await adminService.getAtRiskStudents();
    res.json(atRisk);
  } catch (err) {
    next(err);
  }
};

const generateAdminReport = async (req, res, next) => {
  try {
    const report = await adminService.generateAdminReport(req.query);
    res.json(report);
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
  getMentorStudents,
  assignMentor,
  removeMentorAssignment,
  getXpRules,
  updateXpRules,
  getAnalyticsOverview,
  getAtRiskStudents,
  generateAdminReport
};
