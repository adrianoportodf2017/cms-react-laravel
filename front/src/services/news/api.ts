import { axiosConfig } from '../../lib/axios';
import type { CreateNewsDto, NewsListResponse, NewsResponse } from '../../types/new.types';
/**
 * Cria uma nova notícia
 */
export const CreateNews = async (data: CreateNewsDto): Promise<NewsResponse> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  if (data.slug) formData.append('slug', data.slug);
  if (data.summary) formData.append('summary', data.summary);
  
  // Envia cada propriedade do content separadamente para o Laravel entender como array
  formData.append('content[html]', data.content.html);
  if (data.content.type) formData.append('content[type]', data.content.type);
  
  formData.append('status', data.status);
  
  if (data.featured_image) {
    formData.append('featured_image', data.featured_image);
  }
  
  if (data.category_id) formData.append('category_id', data.category_id);
  if (data.author_id) formData.append('author_id', data.author_id);
  if (data.author_name) formData.append('author_name', data.author_name);
  if (data.is_featured !== undefined) formData.append('is_featured', data.is_featured ? '1' : '0');
  if (data.display_order !== undefined) formData.append('display_order', String(data.display_order));
  if (data.published_at) formData.append('published_at', data.published_at);

  const response = await axiosConfig.post<NewsResponse>('/admin/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Atualiza uma notícia
 */
export const UpdateNews = async (
  id: string,
  data: Partial<CreateNewsDto>
): Promise<NewsResponse> => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.slug) formData.append('slug', data.slug);
  if (data.summary !== undefined) formData.append('summary', data.summary || '');
  
  // Envia cada propriedade do content separadamente
  if (data.content) {
    formData.append('content[html]', data.content.html);
    if (data.content.type) formData.append('content[type]', data.content.type);
  }
  
  if (data.status) formData.append('status', data.status);
  
  if (data.featured_image) {
    formData.append('featured_image', data.featured_image);
  }
  
  if (data.category_id !== undefined) formData.append('category_id', data.category_id || '');
  if (data.author_id !== undefined) formData.append('author_id', data.author_id || '');
  if (data.author_name !== undefined) formData.append('author_name', data.author_name || '');
  if (data.is_featured !== undefined) formData.append('is_featured', data.is_featured ? '1' : '0');
  if (data.display_order !== undefined) formData.append('display_order', String(data.display_order));
  if (data.published_at !== undefined) formData.append('published_at', data.published_at || '');

  const response = await axiosConfig.post<NewsResponse>(`/admin/news/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Lista notícias com filtros
 */
export const ListNews = async (params?: {
  page?: number;
  per_page?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  category_id?: string;
  is_featured?: boolean;
  author_id?: string;
}): Promise<NewsListResponse> => {
  const response = await axiosConfig.get<NewsListResponse>('/admin/news', { params });
  return response.data;
};

/**
 * Busca notícia por ID
 */
export const GetNewsById = async (id: string): Promise<NewsResponse> => {
  const response = await axiosConfig.get<NewsResponse>(`/admin/news/${id}`);
  return response.data;
};

/**
 * Busca notícia por slug
 */
export const GetNewsBySlug = async (slug: string): Promise<NewsResponse> => {
  const response = await axiosConfig.get<NewsResponse>(`/admin/news/${slug}`);
  return response.data;
};

/**
 * Deleta notícia
 */
export const DeleteNews = async (id: string): Promise<void> => {
  await axiosConfig.delete(`/admin/news/${id}`);
};

/**
 * Publica notícia
 */
export const PublishNews = async (id: string): Promise<NewsResponse> => {
  const response = await axiosConfig.patch<NewsResponse>(`/admin/news/${id}/publish`);
  return response.data;
};

/**
 * Arquiva notícia
 */
export const ArchiveNews = async (id: string): Promise<NewsResponse> => {
  const response = await axiosConfig.patch<NewsResponse>(`/admin/news/${id}/archive`);
  return response.data;
};

/**
 * Duplica notícia
 */
export const DuplicateNews = async (id: string): Promise<NewsResponse> => {
  const response = await axiosConfig.post<NewsResponse>(`/admin/news/${id}/duplicate`);
  return response.data;
};

/**
 * Lista notícias publicadas (público)
 */
export const ListPublishedNews = async (params?: {
  page?: number;
  per_page?: number;
  category_id?: string;
  is_featured?: boolean;
}): Promise<NewsListResponse> => {
  const response = await axiosConfig.get<NewsListResponse>('/admin/news/published', { params });
  return response.data;
};




