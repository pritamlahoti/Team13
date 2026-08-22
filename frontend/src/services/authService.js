export const authService = {
  login: async (email, password) => {
    // Mock mentor login
    if (email === 'mentor@katalyst.com') {
      const user = {
        id: 'm1',
        name: 'Dr. Smith',
        role: 'MENTOR',
        email: 'mentor@katalyst.com'
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }
};
