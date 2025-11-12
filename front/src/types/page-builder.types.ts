// src/types/page-builder.types.ts
import type { Data } from '@measured/puck';

/**
 * Types para o Page Builder
 */

// Use tipos mais genéricos que sejam compatíveis com o Puck
export type PuckData = {
  root: {
    props: {
      title?: string;
      [key: string]: unknown;
    };
  };
  content: Array<{
    type: string;
    props: {
      id: string;
      [key: string]: unknown;
    };
  }>;
  zones?: Record<string, any>; // Use any aqui para compatibilidade
};

export interface PageContent {
  html: string;
  puck?: PuckData;
}

export interface CreatePageDto {
  name: string;
  slug: string;
  content: PageContent;
  status: 'draft' | 'published' | 'archived';
  category_id?: string | null;
  is_featured?: boolean;
  display_order?: number;
  in_main_menu?: boolean;
  parent_id?: string | null;
  author_id?: string | null;
  author_name?: string | null;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  content?: {
    html?: string;
    puck?: any;
  };
  
  // ✅ Campos extras
  display_order?: number;
  in_main_menu?: boolean;
  is_featured?: boolean;
  category_id?: string | null;
  parent_id?: string | null;
  author_name?: string | null;
}

export interface PageResponse {
  data: Page;
  message?: string;
}

export interface PagesListResponse {
  data: Page[];
  total: number;
  page: number;
  per_page: number;
}

// Funções de conversão para garantir compatibilidade
export const convertToPuckData = (data: Data): PuckData => {
  return {
    root: {
      props: {
        title: data.root?.props?.title || '',
        ...data.root?.props
      }
    },
    content: Array.isArray(data.content) ? data.content : [],
    zones: data.zones || {}
  };
};

export const convertFromPuckData = (puckData: PuckData): Data => {
  return {
    root: puckData.root as any,
    content: puckData.content as any,
    zones: puckData.zones as any
  };
};

// Type guard para verificar se é PuckData válido
export const isPuckData = (data: unknown): data is PuckData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'root' in data &&
    typeof (data as PuckData).root === 'object' &&
    (data as PuckData).root !== null &&
    'props' in (data as PuckData).root
  );
};