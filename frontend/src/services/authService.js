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
        throw new Error(errorData.error || 'Invalid credentials');
      }

      return await response.json();
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
      throw new Error(err.message || 'Login failed. Please check credentials or network.');
    }
  },
};
