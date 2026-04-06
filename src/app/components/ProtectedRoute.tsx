import { Navigate } from 'react-router-dom';
import { authService } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
