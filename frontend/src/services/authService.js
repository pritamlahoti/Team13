const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.warn('Backend connection failed, using mock auth fallback', err);
      // Fallback credentials for testing/demoing
      if (email === 'admin@questacademy.org' && password === 'admin123') {
        return {
          user: { id: 'admin-id', name: 'Zack Chen', email, role: 'KATALYST_MANAGEMENT' },
          token: 'mock-jwt-token-for-admin',
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

  getUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [studentsRes, mentorsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/students?limit=100`, { headers }),
        fetch(`${API_URL}/api/admin/mentors?limit=100`, { headers })
      ]);
      if (studentsRes.ok && mentorsRes.ok) {
        const { data: students } = await studentsRes.json();
        const { data: mentors } = await mentorsRes.json();
        return [
          ...students.map(s => ({ ...s, role: 'STUDENT', mentor: null })),
          ...mentors.map(m => ({ ...m, role: 'KATALYST_MANAGEMENT' }))
        ];
      }
    } catch (err) {
      console.warn('Backend fetch failed, returning mock users database', err);
    }
    
    // In-memory / localStorage simulation for full interactive experience
    const stored = localStorage.getItem('mock_users_db');
    if (stored) {
      return JSON.parse(stored);
    }
    
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
  
  // The User model has no mentor relation and PUT /users/:id/mentor doesn't
  // exist server-side yet (backend admin.routes.js flags this as needing a
  // schema change) — this always runs the local simulation below.
  assignMentor: async (studentId, mentorId) => {
    // Update frontend simulation
    const stored = localStorage.getItem('mock_users_db');
    if (stored) {
      const users = JSON.parse(stored);
      const mentors = users.filter(u => u.role === 'KATALYST_MANAGEMENT' || u.role === 'HIGHER_MANAGEMENT');
      const selectedMentor = mentors.find(m => m.id === mentorId) || null;
      
      const updated = users.map(user => {
        if (user.id === studentId) {
          return { ...user, mentor: selectedMentor };
        }
        return user;
      });
      localStorage.setItem('mock_users_db', JSON.stringify(updated));
    }
    
    return { success: true, studentId, mentorId };
  }
};
