import api from '../api';

/**
 * Tipos de dados
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

/**
 * Service de Autenticação
 */
class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Salva o token e usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Remove dados do localStorage independente do resultado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Registra novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      // Salva o token e usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Busca dados do usuário atual
   */
  async me(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      
      // Atualiza os dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Reseta a senha com token
   */
  async resetPassword(data: {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  }): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Retorna o usuário do localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Retorna o token do localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Trata erros da API
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Erro com resposta do servidor
      const message = error.response.data?.message || error.response.data?.erro || 'Erro ao processar requisição';
      const errors = error.response.data?.errors;
      
      if (errors) {
        // Se houver erros de validação, concatena as mensagens
        const errorMessages = Object.values(errors).flat().join(', ');
        return new Error(errorMessages);
      }
      
      return new Error(message);
    } else if (error.request) {
      // Erro sem resposta do servidor
      return new Error('Servidor não respondeu. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      return new Error(error.message || 'Erro desconhecido');
    }
  }
}

export default new AuthService();