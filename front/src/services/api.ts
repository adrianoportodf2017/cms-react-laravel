import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

/**
 * Configuração base do Axios para comunicação com a API
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de Request - Adiciona token automaticamente
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adiciona API Token se configurado (para rotas específicas)
    const apiToken = import.meta.env.VITE_API_TOKEN;
    if (apiToken) {
      config.headers['X-API-Token'] = apiToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response - Trata erros globalmente
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Erro de servidor
    if (error.response?.status === 500) {
      console.error('Erro interno do servidor:', error);
    }

    return Promise.reject(error);
  }
);

export default api;