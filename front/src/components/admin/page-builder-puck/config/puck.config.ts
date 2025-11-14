/**
 * Configuração principal do Puck Editor
 */

import type { ComponentConfig, Config } from '@measured/puck';
import {
  HeroBlockConfig,
  ImageBlockConfig,
  CardGridBlockConfig,
  CTABlockConfig,
  SpacerBlockConfig,
  DividerBlockConfig,
} from './blocks.config';
import { ContainerConfig } from '../config/container.config';
import { ColumnsConfig } from '../config/colums.config';
import { RichTextConfig } from '../config/richtext.config';
import { DropdownConfig  } from '../config/accordion.config';
import { ImageConfig  } from '../config/image.config';



type FixedComponentConfig = ComponentConfig<any>;

const createConfig = (config: {
  components: Record<string, FixedComponentConfig>,
  categories: Config['categories']
}): Config => config as Config;

/**
 * Configuração completa do Puck
 */
export const puckConfig = createConfig({
  components: {
    Container: ContainerConfig as FixedComponentConfig,
    Columns: ColumnsConfig as FixedComponentConfig,
    Hero: HeroBlockConfig as FixedComponentConfig,
    CardGrid: CardGridBlockConfig as FixedComponentConfig,
    CTA: CTABlockConfig as FixedComponentConfig,
    Texto: RichTextConfig as FixedComponentConfig,
    Dropdown: DropdownConfig as FixedComponentConfig,
    Spacer: SpacerBlockConfig as FixedComponentConfig,
    Divider: DividerBlockConfig as FixedComponentConfig,
    Image: ImageConfig as FixedComponentConfig,
  },
  categories: {
    layout: {
      components: ['Container', 'Columns', 'Hero', 'Spacer', 'Divider'],
      title: 'Layout',
      defaultExpanded: true,
    },
    content: {
      components: [ 'Texto', 'CTA', 'Dropdown', 'Image'],
      title: 'Conteúdo',
      defaultExpanded: true,
    },
    media: {
      components: ['Image'],
      title: 'Mídia',
      defaultExpanded: false,
    },
    advanced: {
      components: ['CardGrid'],
      title: 'Avançado',
      defaultExpanded: false,
    },
  },
});

/**
 * Dados iniciais vazios para um novo documento
 */
export const initialData = {
  content: [],
  root: { props: { title: '' } },
};

/**
 * Configurações do editor
 */
export const editorConfig = {
  // Auto-save
  autoSave: true,
  autoSaveInterval: 30000, // 30 segundos

  // Histórico
  enableHistory: true,
  maxHistorySteps: 50,

  // Limites
  maxBlocks: 100,

  // Breakpoints responsivos
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
  },

  // Viewport padrão
  defaultViewport: 'desktop' as const,
};

/**
 * Configuração de UI do editor
 */
export const uiConfig = {
  // Textos
  labels: {
    save: 'Salvar',
    publish: 'Publicar',
    preview: 'Visualizar',
    undo: 'Desfazer',
    redo: 'Refazer',
    addComponent: 'Adicionar Componente',
    deleteComponent: 'Excluir Componente',
    duplicateComponent: 'Duplicar Componente',
    moveUp: 'Mover para Cima',
    moveDown: 'Mover para Baixo',
  },

  // Ícones (emojis como placeholder - depois pode trocar por componentes)
  icons: {
    save: '💾',
    publish: '🚀',
    preview: '👁️',
    undo: '↶',
    redo: '↷',
    add: '➕',
    delete: '🗑️',
    duplicate: '📋',
    moveUp: '⬆️',
    moveDown: '⬇️',
  },

  // Cores do tema
  theme: {
    primary: '#3B82F6',
    secondary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    text: '#111827',
    textSecondary: '#6B7280',
  },
};

/**
 * Configuração de validação
 */
export const validationConfig = {
  // Validação de campos
  rules: {
    required: (value: any) => !!value || 'Campo obrigatório',
    minLength: (min: number) => (value: string) =>
      value.length >= min || `Mínimo de ${min} caracteres`,
    maxLength: (max: number) => (value: string) =>
      value.length <= max || `Máximo de ${max} caracteres`,
    url: (value: string) =>
      /^https?:\/\/.+/.test(value) || 'URL inválida',
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'E-mail inválido',
  },

  // Mensagens de erro
  messages: {
    saveError: 'Erro ao salvar. Tente novamente.',
    publishError: 'Erro ao publicar. Tente novamente.',
    loadError: 'Erro ao carregar página. Recarregue a página.',
    uploadError: 'Erro ao fazer upload. Tente novamente.',
  },
};

/**
 * Configuração de assets (imagens, etc)
 */
export const assetsConfig = {
  // Upload de imagens
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },

  // Upload de vídeos
  videos: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    allowedExtensions: ['.mp4', '.webm', '.ogg'],
  },

  // CDN (se usar)
  cdn: {
    baseUrl: '',
    enabled: false,
  },
};

/**
 * Atalhos de teclado
 */
export const keyboardShortcuts = {
  save: 'mod+s',
  undo: 'mod+z',
  redo: 'mod+shift+z',
  duplicate: 'mod+d',
  delete: 'del',
  preview: 'mod+p',
};