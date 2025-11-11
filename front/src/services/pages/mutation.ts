import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreatePageDto, PageResponse, PagesListResponse } from '../../types/page-builder.types';
import {
  SalvarPagina,
  AtualizarPagina,
  ObterPaginaPorSlug,
  ObterPaginaPorId,
  ListarPaginas,
  DeletarPagina,
  PublicarPagina,
  ArquivarPagina,
  DuplicarPagina,
} from './api';

/**
 * Hook para salvar uma nova página
 */
export const useSalvarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PageResponse, Error, CreatePageDto>({
    mutationFn: SalvarPagina,
    onSuccess: () => {
      // Invalida a lista de páginas para refetch
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para atualizar uma página existente
 */
export const useAtualizarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PageResponse, Error, { id: string; data: Partial<CreatePageDto> }>({
    mutationFn: ({ id, data }) => AtualizarPagina(id, data),
    onSuccess: (data) => {
      // Invalida cache da página específica
      queryClient.invalidateQueries({ queryKey: ['page', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para deletar uma página
 */
export const useDeletarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: DeletarPagina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para publicar uma página
 */
export const usePublicarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PageResponse, Error, string>({
    mutationFn: PublicarPagina,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para arquivar uma página
 */
export const useArquivarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PageResponse, Error, string>({
    mutationFn: ArquivarPagina,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para duplicar uma página
 */
export const useDuplicarPagina = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PageResponse, Error, string>({
    mutationFn: DuplicarPagina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

/**
 * Hook para buscar uma página por ID
 */
export const useObterPaginaPorId = (id: string, enabled = true) => {
  return useQuery<PageResponse, Error>({
    queryKey: ['page', id],
    queryFn: () => ObterPaginaPorId(id),
    enabled: enabled && !!id,
  });
};

/**
 * Hook para buscar uma página por slug
 */
export const useObterPaginaPorSlug = (slug: string, enabled = true) => {
  return useQuery<PageResponse, Error>({
    queryKey: ['page', 'slug', slug],
    queryFn: () => ObterPaginaPorSlug(slug),
    enabled: enabled && !!slug,
  });
};

/**
 * Hook para listar páginas com paginação
 */
export const useListarPaginas = (params?: {
  page?: number;
  per_page?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}) => {
  return useQuery<PagesListResponse, Error>({
    queryKey: ['pages', params],
    queryFn: () => ListarPaginas(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};