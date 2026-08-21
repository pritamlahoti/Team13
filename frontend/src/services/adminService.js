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
