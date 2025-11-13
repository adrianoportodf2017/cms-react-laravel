// src/services/media/mutation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  MediaResponse,
  MediaListResponse,
  MediaStatsResponse,
  CleanOrphanedResponse,
  UploadMediaDto,
  UpdateMediaDto,
  MediaType,
  MediaStatus,
} from '../../types/media.types';
import {
  UploadMedia,
  ListarMedia,
  ObterMediaPorId,
  AtualizarMedia,
  DeletarMedia,
  ObterEstatisticasMedia,
  ListarMediaOrfas,
  LimparMediaOrfas,
} from './api';

/**
 * Hook para upload de mídia
 */
export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation<MediaResponse, Error, UploadMediaDto>({
    mutationFn: UploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-stats'] });
    },
  });
};

/**
 * Hook para atualizar uma mídia
 */
export const useAtualizarMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation<MediaResponse, Error, { id: number; data: UpdateMediaDto }>({
    mutationFn: ({ id, data }) => AtualizarMedia(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['media', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};

/**
 * Hook para deletar uma mídia
 */
export const useDeletarMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: DeletarMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-stats'] });
    },
  });
};

/**
 * Hook para limpar mídias órfãs
 */
export const useLimparMediaOrfas = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CleanOrphanedResponse, Error, number | undefined>({
    mutationFn: (days) => LimparMediaOrfas(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-orphaned'] });
      queryClient.invalidateQueries({ queryKey: ['media-stats'] });
    },
  });
};

/**
 * Hook para buscar uma mídia por ID
 */
export const useObterMediaPorId = (id: number, enabled = true) => {
  return useQuery<MediaResponse, Error>({
    queryKey: ['media', id],
    queryFn: () => ObterMediaPorId(id),
    enabled: enabled && !!id,
  });
};

/**
 * Hook para listar mídias com filtros
 */
export const useListarMedia = (params?: {
  page?: number;
  per_page?: number;
  type?: MediaType;
  category?: string;
  status?: MediaStatus;
  orphaned?: boolean;
  search?: string;
}) => {
  return useQuery<MediaListResponse, Error>({
    queryKey: ['media', params],
    queryFn: () => ListarMedia(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar estatísticas
 */
export const useObterEstatisticasMedia = () => {
  return useQuery<MediaStatsResponse, Error>({
    queryKey: ['media-stats'],
    queryFn: ObterEstatisticasMedia,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para listar mídias órfãs
 */
export const useListarMediaOrfas = () => {
  return useQuery<MediaListResponse, Error>({
    queryKey: ['media-orphaned'],
    queryFn: ListarMediaOrfas,
    staleTime: 5 * 60 * 1000,
  });
};