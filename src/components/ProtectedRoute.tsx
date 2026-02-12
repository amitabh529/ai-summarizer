import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // Optionally show a loader
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
