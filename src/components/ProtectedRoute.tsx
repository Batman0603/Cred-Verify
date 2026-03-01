import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole?: UserRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={dashboardRouteByRole(user!.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
