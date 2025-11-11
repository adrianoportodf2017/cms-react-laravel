import { axiosConfig } from '../../lib/axios';
import type { CreatePageDto, PageResponse, PagesListResponse } from '../../types/page-builder.types';

/**
 * Validações e operações auxiliares
 */
export const debugSaveContent = (htmlContent: string): void => {
  console.log('=== CONTEÚDO A SER SALVO ===');
  console.log('Tamanho:', htmlContent.length);
  console.log('Contém bg-gradient-to-br:', htmlContent.includes('bg-gradient-to-br'));
  console.log('Contém grid-cols-1:', htmlContent.includes('grid-cols-1'));
  console.log('Contém rounded-xl:', htmlContent.includes('rounded-xl'));
};

/**
 * Salva uma nova página (admin)
 */
export const SalvarPagina = async (data: CreatePageDto): Promise<PageResponse> => {
  const response = await axiosConfig.post<PageResponse>('/admin/pages', data);
  return response.data;
};

/**
 * Atualiza uma página (admin)
 */
export const AtualizarPagina = async (
  id: string, 
  data: Partial<CreatePageDto>
): Promise<PageResponse> => {
  const response = await axiosConfig.put<PageResponse>(`/admin/pages/${id}`, data);
  return response.data;
};

/**
 * Busca uma página por slug (PÚBLICO)
 * Observação: não existe GET /admin/pages/{slug}
 */
export const ObterPaginaPorSlug = async (slug: string): Promise<PageResponse> => {
  const response = await axiosConfig.get<PageResponse>(`/pages/${slug}`);
  return response.data;
};

/**
 * Busca uma página por ID (PÚBLICO)
 */
export const ObterPaginaPorId = async (id: string): Promise<PageResponse> => {
  const response = await axiosConfig.get<PageResponse>(`/pages/${id}`);
  return response.data;
};

/**
 * Lista páginas (admin) com paginação/filtros
 */
export const ListarPaginas = async (params?: {
  page?: number;
  per_page?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  category_id?: string;
  is_featured?: boolean;
  in_main_menu?: boolean;
  parent_id?: string | null;
  author_id?: string;
}): Promise<PagesListResponse> => {
  const response = await axiosConfig.get<PagesListResponse>('/admin/pages', { params });
  return response.data;
};

/**
 * Deleta uma página (admin)
 */
export const DeletarPagina = async (id: string): Promise<void> => {
  await axiosConfig.delete(`/admin/pages/${id}`);
};

/**
 * Publica (admin)
 */
export const PublicarPagina = async (id: string): Promise<PageResponse> => {
  const response = await axiosConfig.patch<PageResponse>(`/admin/pages/${id}/publish`);
  return response.data;
};

/**
 * Arquiva (admin)
 */
export const ArquivarPagina = async (id: string): Promise<PageResponse> => {
  const response = await axiosConfig.patch<PageResponse>(`/admin/pages/${id}/archive`);
  return response.data;
};

/**
 * Duplica (admin)
 */
export const DuplicarPagina = async (id: string): Promise<PageResponse> => {
  const response = await axiosConfig.post<PageResponse>(`/admin/pages/${id}/duplicate`);
  return response.data;
};
