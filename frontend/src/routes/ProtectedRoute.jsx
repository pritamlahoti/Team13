export default function ProtectedRoute({ children }) {
  // TODO: Add real authentication logic here
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }
  
  return children;
}
