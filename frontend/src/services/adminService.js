import { api } from './api';

export const adminService = {
  // 1. Dashboard
  getDashboard: () => api.request('/api/admin/dashboard'),
  
  // 2-6. Activities
  getActivities: () => api.request('/api/admin/activities'),
  
  createActivity: (activityData) => api.request('/api/admin/activities', {
    method: 'POST',
    body: JSON.stringify(activityData)
  }),
  
  getActivityDetails: (id) => api.request(`/api/admin/activities/${id}`),
  
  updateActivity: (id, activityData) => api.request(`/api/admin/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(activityData)
  }),
  
  updateActivityStatus: (id, status) => api.request(`/api/admin/activities/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  
  // 7-9. Students
  getStudents: () => api.request('/api/admin/students'),
  
  getStudentDetails: (id) => api.request(`/api/admin/students/${id}`),
  
  getStudentProgress: (id) => api.request(`/api/admin/students/${id}/progress`),
  
  // 10-12. Mentors
  getMentors: () => api.request('/api/admin/mentors'),
  
  assignMentor: (studentId, mentorId) => api.request('/api/admin/mentor-assignments', {
    method: 'POST',
    body: JSON.stringify({ studentId, mentorId })
  }),
  
  removeMentorAssignment: (mentorId, studentId) => api.request(`/api/admin/mentor-assignments/${mentorId}/${studentId}`, {
    method: 'DELETE'
  }),
  
  // 13. Analytics
  getAnalyticsOverview: () => api.request('/api/admin/analytics/overview'),
  
  // 14. At-Risk
  getAtRiskStudents: () => api.request('/api/admin/engagement/at-risk'),
  
  // 15. Reports
  getReports: () => api.request('/api/admin/reports')
};

const MOCK_ADMIN_DASHBOARD = {
  totalStudents: 5,
  totalMentors: 2,
  activeEnrollments: 12,
  pendingSubmissions: 3,
  avgXp: 2210,
  participation: 0.87,
  completion: 0.62,
  monthlyEngagement: 0.74,
};

const MOCK_STUDENTS = [
  { id: 'student-id', name: 'Alex Explorer', email: 'student@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: { id: 'admin-1', name: 'Zack Chen' } },
  { id: 'student-2', name: 'Kabir Shah', email: 'kabir@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: null },
  { id: 'student-3', name: 'Ananya Rao', email: 'ananya@questacademy.org', role: 'STUDENT', cohortYear: 2025, mentor: { id: 'admin-2', name: 'Rohan Sharma' } },
  { id: 'student-4', name: 'Shriya Mehta', email: 'shriya@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: null },
  { id: 'student-5', name: 'Vihaan Gupta', email: 'vihaan@questacademy.org', role: 'STUDENT', cohortYear: 2024, mentor: null },
];

const MOCK_MENTORS = [
  { id: 'admin-1', name: 'Zack Chen', email: 'admin@questacademy.org', role: 'KATALYST_MANAGEMENT' },
  { id: 'admin-2', name: 'Rohan Sharma', email: 'rohan.sharma@questacademy.org', role: 'KATALYST_MANAGEMENT' },
];

Object.assign(adminService, {
  /**
   * GET /api/admin/dashboard
   * Returns high-level aggregate stats for the admin overview.
   */
  getDashboard: async () => {
    try {
      return await api.request('/api/admin/dashboard');
    } catch (err) {
      console.warn('[adminService] getDashboard failed, using mock data', err);
      return MOCK_ADMIN_DASHBOARD;
    }
  },

  /**
   * GET /api/admin/students
   * Returns all students with their profile and enrollment info.
   */
  getStudents: async () => {
    try {
      const res = await api.request('/api/admin/students');
      // Normalise — backend may return { data: [...] } or plain array
      return Array.isArray(res) ? res : (res.data ?? []);
    } catch (err) {
      console.warn('[adminService] getStudents failed, using mock data', err);
      const stored = localStorage.getItem('mock_users_db');
      if (stored) {
        const all = JSON.parse(stored);
        return all.filter(u => u.role === 'STUDENT');
      }
      return MOCK_STUDENTS;
    }
  },

  /**
   * GET /api/admin/mentors
   * Returns all mentors (KATALYST_MANAGEMENT).
   */
  getMentors: async () => {
    try {
      const res = await api.request('/api/admin/mentors');
      return Array.isArray(res) ? res : (res.data ?? []);
    } catch (err) {
      console.warn('[adminService] getMentors failed, using mock data', err);
      const stored = localStorage.getItem('mock_users_db');
      if (stored) {
        const all = JSON.parse(stored);
        return all.filter(u => u.role === 'KATALYST_MANAGEMENT' || u.role === 'HIGHER_MANAGEMENT');
      }
      return MOCK_MENTORS;
    }
  },

  /**
   * GET /api/admin/students/:id
   * Returns a single student's profile.
   */
  getStudent: async (id) => {
    try {
      return await api.request(`/api/admin/students/${id}`);
    } catch (err) {
      console.warn('[adminService] getStudent failed, using mock data', err);
      return MOCK_STUDENTS.find(s => s.id === id) ?? null;
    }
  },

  /**
   * GET /api/admin/students/:id/progress
   * Returns a student's module progress summary.
   */
  getStudentProgress: async (id) => {
    try {
      return await api.request(`/api/admin/students/${id}/progress`);
    } catch (err) {
      console.warn('[adminService] getStudentProgress failed, returning empty progress', err);
      return { enrollments: [], totalXp: 0, completedModules: 0 };
    }
  },

  /**
   * GET /api/admin/analytics/overview
   * Returns participation, completion, and engagement metrics.
   */
  getAnalytics: async () => {
    try {
      return await api.request('/api/admin/analytics/overview');
    } catch (err) {
      console.warn('[adminService] getAnalytics failed, using mock data', err);
      return {
        participation: MOCK_ADMIN_DASHBOARD.participation,
        completion: MOCK_ADMIN_DASHBOARD.completion,
        monthlyEngagement: MOCK_ADMIN_DASHBOARD.monthlyEngagement,
      };
    }
  },

  /**
   * GET /api/admin/engagement/at-risk
   * Returns students identified as at risk of falling behind.
   */
  getAtRiskStudents: async () => {
    try {
      const res = await api.request('/api/admin/engagement/at-risk');
      return Array.isArray(res) ? res : (res.data ?? []);
    } catch (err) {
      console.warn('[adminService] getAtRiskStudents failed, using mock data', err);
      // Mock: students without mentors are considered at-risk
      const stored = localStorage.getItem('mock_users_db');
      const all = stored ? JSON.parse(stored) : MOCK_STUDENTS;
      return all.filter(u => u.role === 'STUDENT' && !u.mentor);
    }
  },

  /**
   * GET /api/admin/reports
   * Generates and returns the admin report.
   */
  getReports: async () => {
    try {
      return await api.request('/api/admin/reports');
    } catch (err) {
      console.warn('[adminService] getReports failed, returning empty report', err);
      return { report: 'Report unavailable — backend offline.' };
    }
  },

  /**
   * POST /auth/signup  (requires KATALYST_MANAGEMENT token)
   * Provisions a new user account. Admin-only.
   */
  createUser: async ({ name, email, password, role, cohortYear }) => {
    try {
      return await api.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, cohortYear }),
      });
    } catch (err) {
      console.warn('[adminService] createUser failed, adding to mock DB', err);
      const stored = localStorage.getItem('mock_users_db');
      const users = stored ? JSON.parse(stored) : [];
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        cohortYear: cohortYear ?? null,
        mentor: null,
      };
      users.push(newUser);
      localStorage.setItem('mock_users_db', JSON.stringify(users));
      return newUser;
    }
  },

  /**
   * Assigns a mentor to a student.
   * NOTE: POST /api/admin/mentor-assignments is commented out in the backend
   * (schema change required). Falls back to localStorage update.
   */
  assignMentor: async (studentId, mentorId) => {
    try {
      return await api.request('/api/admin/mentor-assignments', {
        method: 'POST',
        body: JSON.stringify({ studentId, mentorId }),
      });
    } catch (err) {
      console.warn('[adminService] assignMentor — endpoint not yet live, updating local mock', err);
      const stored = localStorage.getItem('mock_users_db');
      if (!stored) return { success: false };
      const users = JSON.parse(stored);
      const mentor = users.find(u => u.id === mentorId) ?? null;
      const updated = users.map(u =>
        u.id === studentId ? { ...u, mentor: mentor ? { id: mentor.id, name: mentor.name } : null } : u
      );
      localStorage.setItem('mock_users_db', JSON.stringify(updated));
      return { success: true, studentId, mentorId };
    }
  },
});
