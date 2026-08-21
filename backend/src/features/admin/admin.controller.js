const adminService = require('./admin.service');

// ============================================================
// DASHBOARD
// ============================================================

/**
 * Retrieves aggregated statistics for the admin dashboard.
 * This includes total students, active activities, total XP, etc.
 */
const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await adminService.getDashboardData();
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};

// ============================================================
// ACTIVITY MANAGEMENT
// ============================================================

/**
 * Lists all activities (sessions, courses, projects, etc.)
 */
const listActivities = async (req, res, next) => {
  try {
    const activities = await adminService.listActivities();
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new activity. 
 * Extracts the request body and the ID of the admin creating it.
 */
const createActivity = async (req, res, next) => {
  try {
    const activity = await adminService.createActivity(req.body, req.user.id);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a single activity by its ID.
 */
const getActivity = async (req, res, next) => {
  try {
    const activity = await adminService.getActivity(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an existing activity.
 */
const updateActivity = async (req, res, next) => {
  try {
    const activity = await adminService.updateActivity(req.params.id, req.body);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates only the status of an activity (e.g., from 'draft' to 'published').
 */
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

// ============================================================
// STUDENT MANAGEMENT
// ============================================================

/**
 * Lists students, optionally filtering by cohort, status, or search query.
 */
const listStudents = async (req, res, next) => {
  try {
    const filters = req.query; // e.g. ?cohort_id=1&status=active
    const students = await adminService.listStudents(filters);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets detailed profile information for a specific student.
 */
const getStudent = async (req, res, next) => {
  try {
    const student = await adminService.getStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets progress metrics (recent XP, submissions) for a specific student.
 */
const getStudentProgress = async (req, res, next) => {
  try {
    const progress = await adminService.getStudentProgress(req.params.id);
    res.json(progress);
  } catch (err) {
    next(err);
  }
};

// ============================================================
// MENTOR MANAGEMENT
// ============================================================

/**
 * Lists all mentors in the platform.
 */
const listMentors = async (req, res, next) => {
  try {
    const mentors = await adminService.listMentors();
    res.json(mentors);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets detailed information for a specific mentor.
 */
const getMentor = async (req, res, next) => {
  try {
    const mentor = await adminService.getMentor(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json(mentor);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the list of students currently assigned to a specific mentor.
 */
const getMentorStudents = async (req, res, next) => {
  try {
    const students = await adminService.getMentorStudents(req.params.id);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * Assigns a student to a mentor.
 */
const assignMentor = async (req, res, next) => {
  try {
    const { mentorId, studentId } = req.body;
    const assignment = await adminService.assignMentor(mentorId, studentId);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

/**
 * Removes (or deactivates) an existing mentor-student assignment.
 */
const removeMentorAssignment = async (req, res, next) => {
  try {
    await adminService.removeMentorAssignment(req.params.mentorId, req.params.studentId);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    next(err);
  }
};

// ============================================================
// XP RULES & ANALYTICS
// ============================================================

/**
 * Retrieves the default XP configuration for different activity types.
 */
const getXpRules = async (req, res, next) => {
  try {
    const rules = await adminService.getXpRules();
    res.json(rules);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the default XP values for activity types.
 */
const updateXpRules = async (req, res, next) => {
  try {
    const rules = await adminService.updateXpRules(req.body);
    res.json(rules);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets a high-level analytics overview (participation, total xp, etc.)
 */
const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsOverview(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * Identifies students who are losing momentum (e.g., inactive for over 7 days).
 */
const getAtRiskStudents = async (req, res, next) => {
  try {
    const atRisk = await adminService.getAtRiskStudents();
    res.json(atRisk);
  } catch (err) {
    next(err);
  }
};

/**
 * Generates an admin report by delegating to the reports service.
 */
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
