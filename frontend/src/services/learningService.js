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

<<<<<<< HEAD
// Initialize localStorage databases for closed-loop testing
const initDB = () => {
  if (!localStorage.getItem('mock_quests_db')) {
    localStorage.setItem('mock_quests_db', JSON.stringify(MOCK_QUESTS));
  }
  if (!localStorage.getItem('mock_enrollments_db')) {
    const initialEnrollments = MOCK_QUESTS.map(q => ({
      id: `enroll-${q.id}`,
      moduleId: q.id,
      status: q.done ? 'completed' : 'enrolled'
    }));
    localStorage.setItem('mock_enrollments_db', JSON.stringify(initialEnrollments));
  }
  if (!localStorage.getItem('mock_submissions_db')) {
    const initialSubmissions = [
      {
        id: 'sub-sample-1',
        userId: 'student-2',
        userName: 'Kabir Shah',
        moduleId: 'project-scope',
        moduleTitle: 'Shape your project scope',
        moduleType: 'project',
        contentRef: 'Proposed a one-page overview for the community learning bot. It will support regional Indian languages to aid digital literacy.',
        submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        status: 'pending',
        feedbackText: '',
        xpAwarded: 0
      }
    ];
    localStorage.setItem('mock_submissions_db', JSON.stringify(initialSubmissions));
  }
};
initDB();

=======
>>>>>>> origin/mohit
export const learningService = {
  getModules: async () => {
    try {
      return await api.request('/modules');
    } catch (err) {
      console.warn('Backend connection failed, using mock modules list', err);
<<<<<<< HEAD
      return JSON.parse(localStorage.getItem('mock_quests_db') || '[]');
    }
  },

  createModule: async (moduleData) => {
    try {
      return await api.request('/modules', {
        method: 'POST',
        body: JSON.stringify(moduleData)
      });
    } catch (err) {
      console.warn('Backend connection failed, saving module to local simulation', err);
    }
    const quests = JSON.parse(localStorage.getItem('mock_quests_db') || '[]');
    const newQuest = {
      id: `quest-${Date.now()}`,
      title: moduleData.title,
      description: moduleData.description || 'Custom mentor-created quest.',
      reward: parseInt(moduleData.reward) || 100,
      progress: 0,
      category: moduleData.type || 'Core skill',
      tint: ['cyan', 'coral', 'violet', 'lime', 'amber'][quests.length % 5],
      due: moduleData.classification === 'mandatory' ? `Due ${moduleData.dueDate || 'tomorrow'}` : 'Optional',
      done: false,
      type: moduleData.type || 'course'
    };
    quests.push(newQuest);
    localStorage.setItem('mock_quests_db', JSON.stringify(quests));

    // Create a corresponding enrollment
    const enrollments = JSON.parse(localStorage.getItem('mock_enrollments_db') || '[]');
    enrollments.push({
      id: `enroll-${newQuest.id}`,
      moduleId: newQuest.id,
      status: 'enrolled'
    });
    localStorage.setItem('mock_enrollments_db', JSON.stringify(enrollments));

    return newQuest;
  },

=======
      return MOCK_QUESTS;
    }
  },

>>>>>>> origin/mohit
  getEnrollments: async () => {
    try {
      return await api.request('/enrollments');
    } catch (err) {
      console.warn('Backend connection failed, using mock enrollments', err);
<<<<<<< HEAD
      return JSON.parse(localStorage.getItem('mock_enrollments_db') || '[]');
=======
      return MOCK_QUESTS.map(q => ({
        id: `enroll-${q.id}`,
        moduleId: q.id,
        status: q.done ? 'completed' : 'enrolled'
      }));
>>>>>>> origin/mohit
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
<<<<<<< HEAD
    }
    const enrollments = JSON.parse(localStorage.getItem('mock_enrollments_db') || '[]');
    const existing = enrollments.find(e => e.moduleId === moduleId);
    if (existing) return existing;

    const newEnrollment = { id: `enroll-${moduleId}`, moduleId, status: 'enrolled' };
    enrollments.push(newEnrollment);
    localStorage.setItem('mock_enrollments_db', JSON.stringify(enrollments));
    return newEnrollment;
=======
      return { id: `enroll-${moduleId}`, moduleId, status: 'enrolled' };
    }
>>>>>>> origin/mohit
  },

  submitWork: async (moduleId, contentRef) => {
    try {
      return await api.request('/submissions', {
        method: 'POST',
        body: JSON.stringify({ moduleId, contentRef })
      });
    } catch (err) {
      console.warn('Backend connection failed, using mock submission', err);
<<<<<<< HEAD
    }
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : { id: 'student-id', name: 'Alex Explorer' };

    const quests = JSON.parse(localStorage.getItem('mock_quests_db') || '[]');
    const quest = quests.find(q => q.id === moduleId) || {};

    const submissions = JSON.parse(localStorage.getItem('mock_submissions_db') || '[]');
    const newSub = {
      id: `sub-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      moduleId,
      moduleTitle: quest.title || 'Sandbox Activity',
      moduleType: quest.type || 'assignment',
      contentRef,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      feedbackText: '',
      xpAwarded: 0
    };
    submissions.push(newSub);
    localStorage.setItem('mock_submissions_db', JSON.stringify(submissions));

    // Update enrollment status
    const enrollments = JSON.parse(localStorage.getItem('mock_enrollments_db') || '[]');
    const updatedEnrollments = enrollments.map(e => {
      if (e.moduleId === moduleId) {
        return { ...e, status: 'completed' }; // complete locally on submit
      }
      return e;
    });
    localStorage.setItem('mock_enrollments_db', JSON.stringify(updatedEnrollments));

    return newSub;
=======
      return { id: `sub-${moduleId}`, moduleId, contentRef, status: 'pending' };
    }
>>>>>>> origin/mohit
  },

  completeEnrollment: async (enrollmentId) => {
    try {
      return await api.request(`/enrollments/${enrollmentId}/complete`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.warn('Backend connection failed, using mock complete enrollment', err);
<<<<<<< HEAD
    }
    const enrollments = JSON.parse(localStorage.getItem('mock_enrollments_db') || '[]');
    const updated = enrollments.map(e => {
      if (e.id === enrollmentId) {
        return { ...e, status: 'completed' };
      }
      return e;
    });
    localStorage.setItem('mock_enrollments_db', JSON.stringify(updated));
    return { id: enrollmentId, status: 'completed' };
  },

  getSubmissions: async () => {
    try {
      return await api.request('/submissions');
    } catch (err) {
      console.warn('Backend connection failed, fetching local simulated submissions', err);
    }
    return JSON.parse(localStorage.getItem('mock_submissions_db') || '[]');
  },

  reviewSubmission: async (submissionId, feedbackText, xpAwarded) => {
    try {
      // Stub backend review
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/submissions/${submissionId}/ai-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feedbackText, xpAwarded })
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.warn('Backend connection failed, performing simulated submission review', err);
    }

    // Process review in localStorage
    const submissions = JSON.parse(localStorage.getItem('mock_submissions_db') || '[]');
    const subIndex = submissions.findIndex(s => s.id === submissionId);
    if (subIndex === -1) return { success: false };

    const submission = submissions[subIndex];
    submission.status = 'reviewed';
    submission.feedbackText = feedbackText;
    submission.xpAwarded = parseInt(xpAwarded) || 100;
    
    localStorage.setItem('mock_submissions_db', JSON.stringify(submissions));

    // Award XP via XP ledger
    const ledger = JSON.parse(localStorage.getItem('mock_xp_ledger_db') || '[]');
    ledger.push({
      id: `xp-${Date.now()}`,
      userId: submission.userId,
      scored_by: 'management',
      xp_awarded: submission.xpAwarded,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('mock_xp_ledger_db', JSON.stringify(ledger));

    // Also update module status on mock_quests_db to complete if not already
    const quests = JSON.parse(localStorage.getItem('mock_quests_db') || '[]');
    const updatedQuests = quests.map(q => {
      if (q.id === submission.moduleId) {
        return { ...q, done: true, progress: 100 };
      }
      return q;
    });
    localStorage.setItem('mock_quests_db', JSON.stringify(updatedQuests));

    return { success: true, submission };
  },

  getJourneyNodes: async () => {
=======
      return { id: enrollmentId, status: 'completed' };
    }
  },

  getJourneyNodes: async () => {
    // Spatial path is static visual navigation layer on frontend
>>>>>>> origin/mohit
    return MOCK_JOURNEY;
  }
};
