import { api } from './api';

const MOCK_QUESTS = [
  {
    id: "ai-bootcamp",
    title: "AI Fundamentals Bootcamp",
    description: "Finish module 3 and connect the core concepts.",
    reward: 100,
    progress: 72,
    category: "Core skill",
    tint: "cyan",
    due: "Due today",
    done: false,
    type: "course"
  },
  {
    id: "project-scope",
    title: "Shape your project scope",
    description: "Turn your idea into a concise one-page brief.",
    reward: 150,
    progress: 0,
    category: "Project",
    tint: "coral",
    due: "Due Fri, 5 PM",
    done: false,
    type: "project"
  },
  {
    id: "mentor-session",
    title: "Mentor checkpoint",
    description: "Prepare one question for your coaching session.",
    reward: 75,
    progress: 50,
    category: "Mentoring",
    tint: "violet",
    due: "Tomorrow",
    done: false,
    type: "mentoring"
  },
];

const MOCK_JOURNEY = [
  {
    id: "foundation",
    title: "Foundation",
    note: "Core foundations locked in",
    state: "complete",
    reward: 250,
    type: "session"
  },
  {
    id: "first-quest",
    title: "First Quest",
    note: "In progress · 2 of 3 modules",
    state: "current",
    reward: 150,
    type: "project"
  },
  {
    id: "skill-builder",
    title: "Skill Builder",
    note: "Unlocks after your bootcamp",
    state: "open",
    reward: 180,
    type: "course"
  },
  {
    id: "mentor-challenge",
    title: "Mentor Challenge",
    note: "A guided real-world scenario",
    state: "open",
    reward: 200,
    type: "mentoring"
  },
  {
    id: "milestone",
    title: "First Milestone",
    note: "Complete 4 more wins to reveal",
    state: "locked",
    reward: 300,
    type: "milestone"
  },
];

export const learningService = {
  getModules: async () => {
    try {
      return await api.request('/modules');
    } catch (err) {
      console.warn('Backend connection failed, using mock modules list', err);
      return MOCK_QUESTS;
    }
  },

  getEnrollments: async () => {
    try {
      return await api.request('/enrollments');
    } catch (err) {
      console.warn('Backend connection failed, using mock enrollments', err);
      return MOCK_QUESTS.map(q => ({
        id: `enroll-${q.id}`,
        moduleId: q.id,
        status: q.done ? 'completed' : 'enrolled'
      }));
    }
  },

  enrollInModule: async (moduleId) => {
    try {
      return await api.request('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ moduleId })
      });
    } catch (err) {
      console.warn('Backend connection failed, using mock enroll', err);
      return { id: `enroll-${moduleId}`, moduleId, status: 'enrolled' };
    }
  },

  submitWork: async (moduleId, contentRef) => {
    try {
      return await api.request('/submissions', {
        method: 'POST',
        body: JSON.stringify({ moduleId, contentRef })
      });
    } catch (err) {
      console.warn('Backend connection failed, using mock submission', err);
      return { id: `sub-${moduleId}`, moduleId, contentRef, status: 'pending' };
    }
  },

  completeEnrollment: async (enrollmentId) => {
    try {
      return await api.request(`/enrollments/${enrollmentId}/complete`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.warn('Backend connection failed, using mock complete enrollment', err);
      return { id: enrollmentId, status: 'completed' };
    }
  },

  getJourneyNodes: async () => {
    // Spatial path is static visual navigation layer on frontend
    return MOCK_JOURNEY;
  }
};
