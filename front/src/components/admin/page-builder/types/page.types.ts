/**
 * Tipos relacionados às páginas do CMS
 */

import type { BlockData } from './block.types';

/**
 * Status de publicação da página
 */
export const PageStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived',
}

/**
 * Configurações de SEO da página
 */
export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * Metadados da página
 */
export interface PageMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  publishedAt?: string;
  version: number;
}

/**
 * Configurações de layout da página
 */
export interface PageLayout {
  template?: string;
  maxWidth?: string;
  backgroundColor?: string;
  padding?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

/**
 * Estrutura completa de uma página
 */
export interface Page {
  id: string;
  title: string;
  slug: string;
  status: typeof PageStatus[keyof typeof PageStatus];
  content: BlockData[];
  seo?: PageSEO;
  layout?: PageLayout;
  metadata: PageMetadata;
  thumbnail?: string;
  tags?: string[];
  category?: string;
}

/**
 * Dados para criar uma nova página
 */
export interface CreatePageDto {
  title: string;
  slug?: string;
  content?: BlockData[];
  status?: typeof PageStatus[keyof typeof PageStatus];
  seo?: PageSEO;
  layout?: PageLayout;
}

/**
 * Dados para atualizar uma página existente
 */
export interface UpdatePageDto extends Partial<CreatePageDto> {
  id: string;
}

/**
 * Resposta da API ao listar páginas
 */
export interface PagesResponse {
  data: Page[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Filtros para busca de páginas
 */
export interface PageFilters {
  status?: typeof PageStatus[keyof typeof PageStatus];
  search?: string;
  category?: string;
  tags?: string[];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Opções de ordenação
 */
export interface PageSortOptions {
  field: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
  order: 'asc' | 'desc';
}