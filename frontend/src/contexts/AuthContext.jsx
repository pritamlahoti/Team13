/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    // Optimistic: restore from localStorage immediately so UI doesn't flash
    const stored = localStorage.getItem('user');
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });
  // loading = true while we're verifying the token with the backend
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  // On mount: if a token is present, verify it with GET /auth/me to ensure
  // the session is still valid and get the latest user profile from the server.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return; // no token — nothing to verify, loading stays false from useState

    authService.me()
      .then(freshUser => {
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } else {
          // Token invalid or expired — clear session
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .catch(() => {
        // Network error — keep optimistic cached user, don't log out
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // run once on mount

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
