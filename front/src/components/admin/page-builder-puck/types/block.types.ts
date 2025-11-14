/**
 * Tipos relacionados aos blocos do Page Builder
 */

/**
 * Tipos relacionados aos blocos do Page Builder
 */
import type { ReactNode } from 'react';

/**
 * Tipos de blocos disponíveis no editor
 */
export const BlockType = {
  HERO: 'hero',
  TEXT: 'text',
  IMAGE: 'image',
  CARD_GRID: 'card-grid',
  CALL_TO_ACTION: 'cta',
  SPACER: 'spacer',
  DIVIDER: 'divider',
  VIDEO: 'video',
  GALLERY: 'gallery',
  FORM: 'form',
}

/**
 * Categorias de blocos para organização na sidebar
 */
export const BlockCategory = {
  LAYOUT: 'layout',
  CONTENT: 'content',
  MEDIA: 'media',
  FORMS: 'forms',
  ADVANCED: 'advanced',
}

/**
 * Configuração de um campo do bloco
 */
export interface BlockField {
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'image' | 'color' | 'custom';
  label: string;
  defaultValue?: any;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
  validation?: (value: any) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Propriedades base de um bloco
 */
export interface BlockProps {
  id: string;
  type: typeof BlockType[keyof typeof BlockType];
  [key: string]: any;
}

/**
 * Configuração completa de um bloco
 */
export interface BlockConfig {
  type: typeof BlockType[keyof typeof BlockType];
  label: string;
  category: typeof BlockCategory[keyof typeof BlockCategory];
  icon?: ReactNode;
  description?: string;
  fields: Record<string, BlockField>;
  defaultProps?: Partial<BlockProps>;
  render: (props: BlockProps) => ReactNode;
}

/**
 * Dados de um bloco instanciado na página
 */
export interface BlockData {
  id: string;
  type: typeof BlockType[keyof typeof BlockType];
  props: BlockProps;
}

/**
 * Metadata do bloco para exibição no editor
 */
export interface BlockMetadata {
  label: string;
  icon?: ReactNode;
  category: typeof BlockCategory[keyof typeof BlockCategory];
  description?: string;
  previewImage?: string;
}