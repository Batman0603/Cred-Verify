import { Navigate } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: UserRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={dashboardRouteByRole(user!.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
