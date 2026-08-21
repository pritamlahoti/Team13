import { api } from './api';

export const teamsService = {
  /**
   * POST /teams  (KATALYST_MANAGEMENT only)
   * Creates a new team.
   */
  createTeam: (name) => api.request('/teams', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),

  /**
   * POST /teams/:id/members  (KATALYST_MANAGEMENT only)
   * Adds a user to a team.
   */
  addMember: (teamId, userId) => api.request(`/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),

  /**
   * GET /teams/:id
   * Returns a team with its members.
   */
  getTeam: (id) => api.request(`/teams/${id}`),
};
