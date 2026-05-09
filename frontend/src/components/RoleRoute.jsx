import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Restricts access to a specific role (e.g., 'employee' or 'recruiter').
 */
const RoleRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Fallback to ProtectedRoute logic if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (user.role !== requiredRole) {
    // Redirect to their respective dashboard if they try to access wrong routes
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
