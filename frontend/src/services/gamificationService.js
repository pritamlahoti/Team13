import { api } from './api';

const MOCK_LEADERBOARD = [
  { position: 1, name: "Ananya Rao", level: 10, initials: "AR", hue: "lime" },
  { position: 2, name: "Kabir Shah", level: 9, initials: "KS", hue: "amber" },
  { position: 3, name: "Shriya Mehta", level: 7, initials: "SM", hue: "cyan", mine: true },
  { position: 4, name: "Vihaan Gupta", level: 7, initials: "VG", hue: "coral" },
];

export const gamificationService = {
  getXp: async (userId) => {
    try {
      const data = await api.request(`/users/${userId}/xp`);
      return data.totalXp ?? 0;
    } catch (err) {
      console.warn('Backend connection failed, using mock XP total', err);
      return 1380; // Shriya's mock total
    }
  },
  
  getLedger: async (userId) => {
    try {
      return await api.request(`/users/${userId}/xp/ledger`);
    } catch (err) {
      console.warn('Backend connection failed, using mock XP ledger', err);
      return [
        { id: '1', scored_by: 'ai_coach', xp_awarded: 250, created_at: new Date().toISOString() },
        { id: '2', scored_by: 'management', xp_awarded: 150, created_at: new Date().toISOString() }
      ];
    }
  },
  
  getLeaderboard: async () => {
    // Standard static leaderboard fallback for the cohort/student view
    return MOCK_LEADERBOARD;
  },

  getAIProgressUpdate: async (userId) => {
    try {
      const data = await api.request(`/users/${userId}/progress-updates`);
      return data.update;
    } catch (err) {
      console.warn('Backend connection failed, using mock progress update', err);
      return "You have a strong start. Finish the Bootcamp module and you will be 20 XP from a level-up.";
    }
  }
};
