import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface GuestRouteProps { 
  children: ReactNode; 
  redirectTo?: string; 
}

/**
 * GuestRoute - Apenas para usuários NÃO autenticados
 * Se o usuário já estiver logado, redireciona para área restrita
 * Usado para: Login, Registro, Recuperar Senha
 */
export function GuestRoute({ children, redirectTo = '/admin' }: GuestRouteProps) {
  const isAuthenticated = localStorage.getItem('token');
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
}