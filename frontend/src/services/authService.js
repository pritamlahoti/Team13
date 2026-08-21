const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const authService = {
  /**
   * POST /auth/login
   * Authenticates a user and returns { user, token }.
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Invalid credentials');
      }

      const data = await response.json();
      // Backend roles are lowercase (e.g. "katalyst_management"); the rest of
      // the frontend (Sidebar, Admin, MentorDashboard role guards) compares
      // against the uppercase ROLES-style strings used by the mock fallback
      // below, so normalize here at the single point real auth data enters.
      data.user.role = data.user.role.toUpperCase();
      return data;
    } catch (err) {
      console.warn('[authService] Backend connection failed, using mock auth fallback', err);

      // Mock fallback credentials for offline / demo use
      if (email === 'admin@questacademy.org' && password === 'admin123') {
        return {
          user: { id: 'admin-1', name: 'Zack Chen', email, role: 'KATALYST_MANAGEMENT' },
          token: 'mock-jwt-token-for-mentor',
        };
      }
      if (email === 'student@questacademy.org' && password === 'student123') {
        return {
          user: { id: 'student-id', name: 'Alex Explorer', email, role: 'STUDENT' },
          token: 'mock-jwt-token-for-student',
        };
      }
      if (email === 'director@questacademy.org' && password === 'director123') {
        return {
          user: { id: 'admin-3', name: 'Priya Iyer', email, role: 'HIGHER_MANAGEMENT' },
          token: 'mock-jwt-token-for-director',
        };
      }
      throw new Error(err.message || 'Login failed. Please check credentials or network.', { cause: err });
    }
  },

  /**
   * GET /auth/me
   * Validates the stored JWT and returns the current user's profile.
   * Used by AuthContext on app load to restore sessions.
   */
  me: async () => {
    const token = localStorage.getItem('token');
    if (!token || token.startsWith('mock-')) {
      // Mock tokens are not real JWTs — restore user from localStorage directly
      const stored = localStorage.getItem('user');
      try { return stored ? JSON.parse(stored) : null; } catch { return null; }
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn('[authService] /auth/me failed — using cached user', err);
      const stored = localStorage.getItem('user');
      try { return stored ? JSON.parse(stored) : null; } catch { return null; }
    }
  },

  /**
   * GET /api/admin/students + /api/admin/mentors
   * Returns all users merged. Falls back to localStorage mock.
   * NOTE: Previously incorrectly called /users (non-existent endpoint).
   */
  getUsers: async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [studentsRes, mentorsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/students`, { headers }),
        fetch(`${API_URL}/api/admin/mentors`, { headers }),
      ]);

      if (studentsRes.ok && mentorsRes.ok) {
        const studentsJson = await studentsRes.json();
        const mentorsJson = await mentorsRes.json();
        // Normalise — backend may return { data: [...] } or plain array
        const students = Array.isArray(studentsJson) ? studentsJson : (studentsJson.data ?? []);
        const mentors = Array.isArray(mentorsJson) ? mentorsJson : (mentorsJson.data ?? []);
        return [...students, ...mentors];
      }
    } catch (err) {
      console.warn('[authService] getUsers backend fetch failed, using localStorage mock', err);
    }

    // In-memory / localStorage simulation for offline demo
    const stored = localStorage.getItem('mock_users_db');
    if (stored) return JSON.parse(stored);

    const initialUsers = [
      { id: 'student-id', name: 'Alex Explorer', email: 'student@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: { id: 'admin-1', name: 'Zack Chen' } },
      { id: 'student-2', name: 'Kabir Shah', email: 'kabir@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: null },
      { id: 'student-3', name: 'Ananya Rao', email: 'ananya@questacademy.org', role: 'STUDENT', cohortYear: 2025, mentor: { id: 'admin-2', name: 'Rohan Sharma' } },
      { id: 'student-4', name: 'Shriya Mehta', email: 'shriya@questacademy.org', role: 'STUDENT', cohortYear: 2026, mentor: null },
      { id: 'student-5', name: 'Vihaan Gupta', email: 'vihaan@questacademy.org', role: 'STUDENT', cohortYear: 2024, mentor: null },
      { id: 'admin-1', name: 'Zack Chen', email: 'admin@questacademy.org', role: 'KATALYST_MANAGEMENT' },
      { id: 'admin-2', name: 'Rohan Sharma', email: 'rohan.sharma@questacademy.org', role: 'KATALYST_MANAGEMENT' },
      { id: 'admin-3', name: 'Priya Iyer', email: 'director@questacademy.org', role: 'HIGHER_MANAGEMENT' },
    ];
    localStorage.setItem('mock_users_db', JSON.stringify(initialUsers));
    return initialUsers;
  },

  /**
   * Assigns a mentor to a student.
   * NOTE: POST /api/admin/mentor-assignments is not yet live on the backend
   * (requires a schema migration). Falls back to localStorage update.
   */
  assignMentor: async (studentId, mentorId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/admin/mentor-assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, mentorId }),
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.warn('[authService] assignMentor — endpoint not yet live, updating local mock DB', err);
    }

    // Offline: update mock database in localStorage
    const stored = localStorage.getItem('mock_users_db');
    if (stored) {
      const users = JSON.parse(stored);
      const mentor = users.find(u => u.id === mentorId) ?? null;
      const updated = users.map(user => {
        if (user.id === studentId) {
          return { ...user, mentor: mentor ? { id: mentor.id, name: mentor.name } : null };
        }
        return user;
      });
      localStorage.setItem('mock_users_db', JSON.stringify(updated));
    }

    return { success: true, studentId, mentorId };
  },
};
