export default function PublicRoute({ children }) {
  // TODO: Add real authentication logic here
  const isAuthenticated = false;
  
  if (isAuthenticated) {
    return <div>Redirecting to dashboard...</div>;
  }
  
  return children;
}
