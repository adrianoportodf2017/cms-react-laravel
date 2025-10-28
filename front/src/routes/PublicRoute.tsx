import type { ReactNode } from 'react';

interface PublicRouteProps { 
  children: ReactNode; 
}

/**
 * PublicRoute - Permite acesso a páginas públicas
 * Usuários autenticados e não autenticados podem acessar
 */
export function PublicRoute({ children }: PublicRouteProps) {
  // Páginas públicas são acessíveis para TODOS
  // Não fazemos verificação de autenticação aqui
  return <>{children}</>;
}