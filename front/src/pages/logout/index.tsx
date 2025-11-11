import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth';
import { toast } from 'sonner';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Chama a função de logout do store
        logout();
        
        // Limpeza adicional
        //localStorage.removeItem('rememberMe');
        sessionStorage.clear();
        
        toast.success('Logout realizado com sucesso!');
      } catch (error) {
        console.error('Erro durante logout:', error);
        toast.error('Erro ao fazer logout');
      } finally {
        // Redireciona para login após um breve delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 100);
      }
    };

    performLogout();
  }, [navigate, logout]);

  // Loading durante o logout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Saindo do sistema...</p>
      </div>
    </div>
  );
}