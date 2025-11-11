import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth';

interface ProtectedRouteProps { 
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Importante: usar replace para não criar histórico
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}