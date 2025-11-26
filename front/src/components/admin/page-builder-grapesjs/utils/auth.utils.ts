// src/components/admin/page-builder-grapesjs/utils/auth.utils.ts

export const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed.token || null;
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
};

export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
};