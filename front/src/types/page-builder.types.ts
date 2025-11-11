/**
 * Types para o Page Builder
 */

export interface PageContent {
  html: string;
  type: 'tiptap-html';
}

export interface CreatePageDto {
  name: string;
  slug: string;
  content: PageContent;
  status: 'draft' | 'published' | 'archived';
  // novos (opcionais inicialmente)
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
  content: PageContent;
  status: 'draft' | 'published' | 'archived';
    in_main_menu?: boolean;

  created_at: string;
  updated_at: string;
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