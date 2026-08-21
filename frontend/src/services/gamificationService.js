import { api } from './api';

const MOCK_LEADERBOARD = [
  { position: 1, name: "Ananya Rao", level: 10, initials: "AR", hue: "lime" },
  { position: 2, name: "Kabir Shah", level: 9, initials: "KS", hue: "amber" },
  { position: 3, name: "Shriya Mehta", level: 7, initials: "SM", hue: "cyan", mine: true },
  { position: 4, name: "Vihaan Gupta", level: 7, initials: "VG", hue: "coral" },
];

<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
// Initialize mock XP database in localStorage
const initXPDB = () => {
  if (!localStorage.getItem('mock_xp_ledger_db')) {
    const initialLedger = [
      // Alex Explorer (student-id): 880 XP total (level 2)
      { id: 'l-1', userId: 'student-id', scored_by: 'ai_coach', xp_awarded: 250, created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString() },
      { id: 'l-2', userId: 'student-id', scored_by: 'management', xp_awarded: 630, created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
      
      // Kabir Shah (student-2): 4200 XP total (level 9)
      { id: 'l-3', userId: 'student-2', scored_by: 'management', xp_awarded: 4200, created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString() },
      
      // Ananya Rao (student-3): 4800 XP total (level 10)
      { id: 'l-4', userId: 'student-3', scored_by: 'management', xp_awarded: 4800, created_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString() },

      // Shriya Mehta (student-4): 3380 XP total (level 7)
      { id: 'l-5', userId: 'student-4', scored_by: 'management', xp_awarded: 3380, created_at: new Date(Date.now() - 4 * 24 * 3600000).toISOString() },

      // Vihaan Gupta (student-5): 3100 XP (level 7)
      { id: 'l-6', userId: 'student-5', scored_by: 'management', xp_awarded: 3100, created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString() }
    ];
    localStorage.setItem('mock_xp_ledger_db', JSON.stringify(initialLedger));
  }
};
initXPDB();

export const gamificationService = {
  getXp: async (userId) => {
    try {
      const data = await api.request(`/users/${userId}/xp`);
      return data.totalXp ?? 0;
    } catch (err) {
<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
      console.warn('Backend connection failed, calculating XP from local ledger', err);
      const ledger = JSON.parse(localStorage.getItem('mock_xp_ledger_db') || '[]');
      const userEntries = ledger.filter(entry => entry.userId === userId);
      return userEntries.reduce((sum, entry) => sum + entry.xp_awarded, 0);
<<<<<<< HEAD
=======

      console.warn('Backend connection failed, using mock XP total', err);
      return 1380; // Shriya's mock total
>>>>>>> 635c609 (starting for admin frontend)
    }
  },
  
  getLedger: async (userId) => {
    try {
      return await api.request(`/users/${userId}/xp/ledger`);
    } catch (err) {
<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
      console.warn('Backend connection failed, using local simulated ledger', err);
      const ledger = JSON.parse(localStorage.getItem('mock_xp_ledger_db') || '[]');
      return ledger
        .filter(entry => entry.userId === userId)
        .reverse(); // Newest first
<<<<<<< HEAD
=======
      console.warn('Backend connection failed, using mock XP ledger', err);
      return [
        { id: '1', scored_by: 'ai_coach', xp_awarded: 250, created_at: new Date().toISOString() },
        { id: '2', scored_by: 'management', xp_awarded: 150, created_at: new Date().toISOString() }
      ];
>>>>>>> 635c609 (starting for admin frontend)
    }
  },
  
  getLeaderboard: async () => {
<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
    try {
      // Stub leaderboard backend if there was one
    } catch {
      console.warn('Backend connection failed, compiling live local leaderboard');
    }

    const ledger = JSON.parse(localStorage.getItem('mock_xp_ledger_db') || '[]');
    const users = JSON.parse(localStorage.getItem('mock_users_db') || '[]');
    const students = users.filter(u => u.role === 'STUDENT');

    if (students.length === 0) {
      return MOCK_LEADERBOARD;
    }

    const scores = students.map(student => {
      const studentXp = ledger
        .filter(entry => entry.userId === student.id)
        .reduce((sum, entry) => sum + entry.xp_awarded, 0);
      const level = Math.floor(studentXp / 500) + 1;
      return {
        id: student.id,
        name: student.name,
        level,
        xp: studentXp,
        initials: student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        hue: ['lime', 'amber', 'cyan', 'coral', 'pink'][student.id.charCodeAt(student.id.length - 1) % 5]
      };
    });

    // Sort descending
    scores.sort((a, b) => b.xp - a.xp);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    return scores.map((s, idx) => ({
      position: idx + 1,
      name: s.name,
      level: s.level,
      initials: s.initials,
      hue: s.hue,
      mine: s.id === currentUser.id
    }));
<<<<<<< HEAD
=======

    // Standard static leaderboard fallback for the cohort/student view
    return MOCK_LEADERBOARD;

>>>>>>> 635c609 (starting for admin frontend)
  },

  getAIProgressUpdate: async (userId) => {
    try {
      const data = await api.request(`/users/${userId}/progress-updates`);
      return data.update;
    } catch (err) {
      console.warn('Backend connection failed, using mock progress update', err);
<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
      const xp = await gamificationService.getXp(userId);
      const nextLevelXp = (Math.floor(xp / 500) + 1) * 500;
      const left = nextLevelXp - xp;
      return `You have completed your daily challenge checkpoints. Finish your pending Bootcamp assignments and you will be only ${left} XP away from Leveling Up!`;
<<<<<<< HEAD
=======

      return "You have a strong start. Finish the Bootcamp module and you will be 20 XP from a level-up.";

>>>>>>> 635c609 (starting for admin frontend)
    }
  }
};
