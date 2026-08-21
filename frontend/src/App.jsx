<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> origin/mohit
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
