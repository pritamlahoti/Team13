const { Router } = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const adminController = require('./admin.controller');

const router = Router();

// Apply auth and admin role to all /api/admin routes
router.use('/api/admin', requireAuth, requireRole('admin'));

// Phase 2: Dashboard
router.get('/api/admin/dashboard', adminController.getDashboard);

// Phase 3 & 4: Activity Management
router.get('/api/admin/activities', adminController.listActivities);
router.post('/api/admin/activities', adminController.createActivity);
router.get('/api/admin/activities/:id', adminController.getActivity);
router.put('/api/admin/activities/:id', adminController.updateActivity);
router.patch('/api/admin/activities/:id/status', adminController.updateActivityStatus);

// Phase 6: Student Management
router.get('/api/admin/students', adminController.listStudents);
router.get('/api/admin/students/:id', adminController.getStudent);
router.get('/api/admin/students/:id/progress', adminController.getStudentProgress);

// Phase 7: Mentor Management
router.get('/api/admin/mentors', adminController.listMentors);
router.get('/api/admin/mentors/:id', adminController.getMentor);
router.get('/api/admin/mentors/:id/students', adminController.getMentorStudents);
router.post('/api/admin/mentor-assignments', adminController.assignMentor);
router.delete('/api/admin/mentor-assignments/:mentorId/:studentId', adminController.removeMentorAssignment);

// Phase 8: XP Rules Management
router.get('/api/admin/xp-rules', adminController.getXpRules);
router.put('/api/admin/xp-rules', adminController.updateXpRules);

// Phase 9 & 10: Analytics and Engagement
router.get('/api/admin/analytics/overview', adminController.getAnalyticsOverview);
router.get('/api/admin/engagement/at-risk', adminController.getAtRiskStudents);

// Phase 11: Reports Integration
router.get('/api/admin/reports', adminController.generateAdminReport);

module.exports = router;
