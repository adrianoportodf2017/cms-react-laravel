import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService, { type User, type LoginCredentials, type RegisterData } from '../services/auth/authService';

/**
 * Interface do Store de Autenticação
 */
interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Store de Autenticação com Zustand
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        token: authService.getToken(),
        isAuthenticated: authService.isAuthenticated(),
        isLoading: false,
        error: null,

        /**
         * Realiza login
         */
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authService.login(credentials);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.message || 'Erro ao fazer login',
            });
            throw error;
          }
        },

        /**
         * Realiza logout
         */
        logout: async () => {
          set({ isLoading: true });
          
          try {
            await authService.logout();
          } catch (error) {
            console.error('Erro ao fazer logout:', error);
          } finally {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        /**
         * Registra novo usuário
         */
        register: async (data) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authService.register(data);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.message || 'Erro ao criar conta',
            });
            throw error;
          }
        },

        /**
         * Carrega dados do usuário atual
         */
        loadUser: async () => {
          const token = get().token;
          
          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          set({ isLoading: true });
          
          try {
            const user = await authService.me();
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error.message || 'Erro ao carregar usuário',
            });
          }
        },

        /**
         * Limpa erros
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Define estado de loading
         */
        setLoading: (isLoading) => {
          set({ isLoading });
        },
      }),
      {
        name: 'auth-storage', // Nome da chave no localStorage
        partialize: (state) => ({
          // Persiste apenas o que é necessário
          token: state.token,
          user: state.user,
        }),
      }
    ),
    { name: 'AuthStore' } // Nome para o DevTools
  )
);