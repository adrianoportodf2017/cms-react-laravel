/**
 * Configurações padrão do Page Builder
 */

import { EditorMode, type EditorConfig } from '../types';

/**
 * Configuração padrão do editor
 */
export const DEFAULT_EDITOR_CONFIG: Partial<EditorConfig> = {
  autoSave: true,
  autoSaveInterval: 30000, // 30 segundos
  enableHistory: true,
  maxHistorySteps: 50,
  maxBlocks: 100,
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
  },
};

/**
 * Modo padrão do editor ao iniciar
 */
export const DEFAULT_EDITOR_MODE = EditorMode.EDIT;

/**
 * Classes Tailwind CSS padrão para os blocos
 */
export const DEFAULT_BLOCK_CLASSES = {
  container: 'w-full',
  wrapper: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  section: 'py-12 md:py-16 lg:py-20',
};

/**
 * Breakpoints para preview responsivo
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    width: 375,
    height: 667,
    label: 'Mobile',
    icon: '📱',
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'Tablet',
    icon: '📱',
  },
  desktop: {
    width: 1440,
    height: 900,
    label: 'Desktop',
    icon: '💻',
  },
};

/**
 * Configurações de grid padrão
 */
export const DEFAULT_GRID_CONFIG = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  gap: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },
};

/**
 * Cores padrão do tema
 */
export const DEFAULT_THEME_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  neutral: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

/**
 * Tipografia padrão
 */
export const DEFAULT_TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Monaco, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Espaçamentos padrão
 */
export const DEFAULT_SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
  '3xl': '6rem',
};

/**
 * Configurações de animação
 */
export const DEFAULT_ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-in-out',
};

/**
 * Mensagens de validação padrão
 */
export const VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  pattern: 'Formato inválido',
  email: 'E-mail inválido',
  url: 'URL inválida',
  number: 'Deve ser um número',
  min: (min: number) => `Valor mínimo: ${min}`,
  max: (max: number) => `Valor máximo: ${max}`,
};

/**
 * Configurações de upload de imagem
 */
export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

/**
 * Configurações de upload de vídeo
 */
export const VIDEO_UPLOAD_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedExtensions: ['.mp4', '.webm', '.ogg'],
};

/**
 * Atalhos de teclado padrão
 */
export const KEYBOARD_SHORTCUTS = {
  save: 'Ctrl+S',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  duplicate: 'Ctrl+D',
  delete: 'Delete',
  preview: 'Ctrl+P',
  selectAll: 'Ctrl+A',
};

/**
 * Configurações de paginação
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 20,
  maxPerPage: 100,
};