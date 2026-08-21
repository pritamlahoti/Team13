const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = {
  getApiUrl: () => API_URL,
  
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const config = {
      ...options,
      headers,
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Backend errors are always { success: false, error: { message } }
      // (see backend/src/middleware/errorHandler.js).
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};
