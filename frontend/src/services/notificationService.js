import { api } from './api';

// Default thresholds for generating escalations
export const THRESHOLDS = {
  // If an activity is overdue by more than this many days, it's an escalation (otherwise a notification)
  OVERDUE_ESCALATION_DAYS: 2,
  // If a submission score is below this percentage, it's an escalation
  SCORE_ESCALATION_THRESHOLD: 60,
};

// Initial mock data
const INITIAL_MOCK_DATA = [
  {
    id: 'notif-1',
    type: 'escalation',
    triggerSource: 'due_date',
    relatedStudentId: 'student-2',
    relatedStudentName: 'Kabir Shah',
    relatedActivityId: 'act-101',
    relatedActivityName: 'React Fundamentals Assessment',
    message: 'Activity is 3 days overdue (Escalation threshold: > 2 days).',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: 'unread',
    audience: 'both', // Seen by both higher management and katalyst management
  },
  {
    id: 'notif-2',
    type: 'notification',
    triggerSource: 'due_date',
    relatedStudentId: 'student-3',
    relatedStudentName: 'Ananya Rao',
    relatedActivityId: 'act-102',
    relatedActivityName: 'Weekly Journal',
    message: 'Activity is due tomorrow.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'unread',
    audience: 'katalyst_management', // Only mentors see regular notifications
  },
  {
    id: 'notif-3',
    type: 'escalation',
    triggerSource: 'scoring',
    relatedStudentId: 'student-5',
    relatedStudentName: 'Vihaan Gupta',
    relatedActivityId: 'act-103',
    relatedActivityName: 'Capstone Project',
    message: 'Student scored 45% (Escalation threshold: < 60%).',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'unread',
    audience: 'both',
  }
];

export const notificationService = {
  /**
   * Get all notifications for a specific audience (role).
   * @param {string} audience - 'higher_management' or 'katalyst_management'
   */
  getNotifications: async (audience) => {
    try {
      // Stubbed backend call:
      // return await api.request(`/api/notifications?audience=${audience}`);
      
      // MOCK IMPLEMENTATION
      const stored = localStorage.getItem('mock_notifications');
      let data = stored ? JSON.parse(stored) : INITIAL_MOCK_DATA;
      
      if (!stored) {
        localStorage.setItem('mock_notifications', JSON.stringify(data));
      }

      // Filter by audience
      return data.filter(item => item.audience === 'both' || item.audience === audience);
      
    } catch (err) {
      console.warn('[notificationService] getNotifications failed', err);
      return [];
    }
  },

  /**
   * Mark a notification or escalation as read or acknowledged.
   * @param {string} id - Notification ID
   * @param {string} status - 'read' | 'acknowledged'
   */
  updateStatus: async (id, status) => {
    try {
      // Stubbed backend call:
      // return await api.request(`/api/notifications/${id}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status })
      // });
      
      // MOCK IMPLEMENTATION
      const stored = localStorage.getItem('mock_notifications');
      if (!stored) return { success: false };
      
      const data = JSON.parse(stored);
      const updatedData = data.map(item => 
        item.id === id ? { ...item, status } : item
      );
      
      localStorage.setItem('mock_notifications', JSON.stringify(updatedData));
      return { success: true, id, status };
      
    } catch (err) {
      console.warn('[notificationService] updateStatus failed', err);
      throw err;
    }
  }
};
