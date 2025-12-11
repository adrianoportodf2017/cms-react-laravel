import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateNewsDto,
  NewsResponse,
  NewsListResponse,
} from '../../types/new.types';
import * as NewsAPI from './api';
import { toast } from 'sonner';

/**
 * Hook para criar notícia
 */
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewsDto) => NewsAPI.CreateNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      // Toast controlado manualmente no componente
    },
    onError: () => {
      // Erro tratado no componente
    },
  });
};

/**
 * Hook para atualizar notícia
 */
export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNewsDto> }) =>
      NewsAPI.UpdateNews(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', variables.id] });
      // Toast controlado manualmente no componente
    },
    onError: () => {
      // Erro tratado no componente
    },
  });
};

/**
 * Hook para deletar notícia
 */
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NewsAPI.DeleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Notícia excluída com sucesso!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao excluir notícia';
      toast.error(message);
    },
  });
};

/**
 * Hook para publicar notícia
 */
export const usePublishNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NewsAPI.PublishNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', id] });
      toast.success('Notícia publicada!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao publicar notícia';
      toast.error(message);
    },
  });
};

/**
 * Hook para arquivar notícia
 */
export const useArchiveNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NewsAPI.ArchiveNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', id] });
      toast.success('Notícia arquivada!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao arquivar notícia';
      toast.error(message);
    },
  });
};

/**
 * Hook para duplicar notícia
 */
export const useDuplicateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NewsAPI.DuplicateNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Notícia duplicada!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao duplicar notícia';
      toast.error(message);
    },
  });
};

/**
 * Hook para buscar notícia por ID
 */
export const useGetNewsById = (id: string, enabled = true) => {
  return useQuery<NewsResponse, Error>({
    queryKey: ['news', id],
    queryFn: () => NewsAPI.GetNewsById(id),
    enabled: enabled && !!id,
  });
};

/**
 * Hook para buscar notícia por slug
 */
export const useGetNewsBySlug = (slug: string, enabled = true) => {
  return useQuery<NewsResponse, Error>({
    queryKey: ['news', 'slug', slug],
    queryFn: () => NewsAPI.GetNewsBySlug(slug),
    enabled: enabled && !!slug,
  });
};

/**
 * Hook para listar notícias
 */
export const useListNews = (params?: {
  page?: number;
  per_page?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  category_id?: string;
  is_featured?: boolean;
  author_id?: string;
}) => {
  return useQuery<NewsListResponse, Error>({
    queryKey: ['news', params],
    queryFn: () => NewsAPI.ListNews(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para listar notícias publicadas (público)
 */
export const useListPublishedNews = (params?: {
  page?: number;
  per_page?: number;
  category_id?: string;
  is_featured?: boolean;
}) => {
  return useQuery<NewsListResponse, Error>({
    queryKey: ['news', 'published', params],
    queryFn: () => NewsAPI.ListPublishedNews(params),
    staleTime: 5 * 60 * 1000,
  });
};