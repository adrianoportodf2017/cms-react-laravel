/**
 * Export centralizado de todos os tipos do Page Builder
 */

// Block types
export type {
  BlockField,
  BlockProps,
  BlockConfig,
  BlockData,
  BlockMetadata,
} from './block.types';

export { BlockType, BlockCategory } from './block.types';

// Page types
export type {
  PageSEO,
  PageMetadata,
  PageLayout,
  Page,
  CreatePageDto,
  UpdatePageDto,
  PagesResponse,
  PageFilters,
  PageSortOptions,
} from './page.types';

export { PageStatus } from './page.types';

// Editor types
export type {
  EditorState,
  EditorActions,
  EditorConfig,
  EditorContext,
  EditorProps,
  RendererProps,
  EditorEventPayload,
  EditorEventListener,
} from '../types/editor.types';

export { EditorMode, EditorEvent } from '../types/editor.types';