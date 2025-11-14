/**
 * Tipos relacionados ao estado e configuração do editor
 */

import type { BlockConfig, BlockData, BlockType } from './block.types';
import type { Page } from './page.types';

/**
 * Modo de visualização do editor
 */
export const EditorMode = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
} as const;

export type EditorMode = typeof EditorMode[keyof typeof EditorMode];

/**
 * Eventos do editor
 */
export const EditorEvent = {
  BLOCK_ADDED: 'block:added',
  BLOCK_REMOVED: 'block:removed',
  BLOCK_UPDATED: 'block:updated',
  BLOCK_MOVED: 'block:moved',
  BLOCK_SELECTED: 'block:selected',
  PAGE_SAVED: 'page:saved',
  PAGE_PUBLISHED: 'page:published',
  MODE_CHANGED: 'mode:changed',
  ERROR: 'error',
} as const;

export type EditorEvent = typeof EditorEvent[keyof typeof EditorEvent];

/**
 * Estado do editor
 */
export interface EditorState {
  mode: EditorMode;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  isDragging: boolean;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  history: {
    past: BlockData[][];
    present: BlockData[];
    future: BlockData[][];
  };
}

/**
 * Ações do editor
 */
export interface EditorActions {
  setMode: (mode: EditorMode) => void;
  selectBlock: (blockId: string | null) => void;
  hoverBlock: (blockId: string | null) => void;
  addBlock: (block: BlockData, index?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, props: Partial<BlockData['props']>) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  duplicateBlock: (blockId: string) => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<void>;
  publish: () => Promise<void>;
  reset: () => void;
}

/**
 * Configuração do editor
 */
export interface EditorConfig {
  blocks: Record<typeof BlockType[keyof typeof BlockType], BlockConfig>;
  allowedBlocks?: Array<typeof BlockType[keyof typeof BlockType]>;
  maxBlocks?: number;
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableHistory?: boolean;
  maxHistorySteps?: number;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  customStyles?: string;
}

/**
 * Contexto do editor (combina estado + ações)
 */
export interface EditorContext {
  state: EditorState;
  actions: EditorActions;
  config: EditorConfig;
  page: Page | null;
}

/**
 * Props do componente Editor
 */
export interface EditorProps {
  pageId?: string;
  initialData?: BlockData[];
  config?: Partial<EditorConfig>;
  onSave?: (data: BlockData[]) => Promise<void>;
  onPublish?: (page: Page) => Promise<void>;
  onChange?: (data: BlockData[]) => void;
}

/**
 * Props do componente Renderer (para visualizar a página)
 */
export interface RendererProps {
  data: BlockData[];
  config: EditorConfig;
  mode?: EditorMode;
}

/**
 * Payload dos eventos do editor
 */
export interface EditorEventPayload {
  [EditorEvent.BLOCK_ADDED]: { block: BlockData; index: number };
  [EditorEvent.BLOCK_REMOVED]: { blockId: string };
  [EditorEvent.BLOCK_UPDATED]: { blockId: string; props: Partial<BlockData['props']> };
  [EditorEvent.BLOCK_MOVED]: { fromIndex: number; toIndex: number };
  [EditorEvent.BLOCK_SELECTED]: { blockId: string | null };
  [EditorEvent.PAGE_SAVED]: { page: Page };
  [EditorEvent.PAGE_PUBLISHED]: { page: Page };
  [EditorEvent.MODE_CHANGED]: { mode: EditorMode };
  [EditorEvent.ERROR]: { error: Error; context?: string };
}

/**
 * Type helper para listeners de eventos
 */
export type EditorEventListener<T extends EditorEvent> = (
  payload: EditorEventPayload[T]
) => void;