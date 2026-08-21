<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> origin/mohit
import { useAuth } from '../hooks/useAuth';

export default function PublicRoute({ children }) {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-theme-berry border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return children;
}
