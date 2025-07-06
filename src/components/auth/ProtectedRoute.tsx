import { Navigate } from 'react-router-dom';
import { useBlog } from '../../contexts/BlogContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useBlog();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}
