// src/services/media/api.ts

import { axiosConfig } from '../../lib/axios';
import type {
  
  MediaResponse,
  MediaListResponse,
  UploadMediaDto,
  UpdateMediaDto,
  MediaStatsResponse,
  CleanOrphanedResponse,
  MediaType,
  MediaStatus,
} from '../../types/media.types';

/**
 * Upload de mídia
 */
export const UploadMedia = async (data: UploadMediaDto): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append('file', data.file);
  
  if (data.category) formData.append('category', data.category);
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.alt_text) formData.append('alt_text', data.alt_text);

  const response = await axiosConfig.post<MediaResponse>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Lista mídias com filtros
 */
export const ListarMedia = async (params?: {
  page?: number;
  per_page?: number;
  type?: MediaType;
  category?: string;
  status?: MediaStatus;
  orphaned?: boolean;
  search?: string;
}): Promise<MediaListResponse> => {
  const response = await axiosConfig.get<MediaListResponse>('/media', { params });
  return response.data;
};

/**
 * Busca uma mídia por ID
 */
export const ObterMediaPorId = async (id: number): Promise<MediaResponse> => {
  const response = await axiosConfig.get<MediaResponse>(`/media/${id}`);
  return response.data;
};

/**
 * Atualiza informações da mídia
 */
export const AtualizarMedia = async (
  id: number,
  data: UpdateMediaDto
): Promise<MediaResponse> => {
  const response = await axiosConfig.put<MediaResponse>(`/media/${id}`, data);
  return response.data;
};

/**
 * Deleta uma mídia (arquivo + registro)
 */
export const DeletarMedia = async (id: number): Promise<void> => {
  await axiosConfig.delete(`/media/${id}`);
};

/**
 * Busca estatísticas de mídias
 */
export const ObterEstatisticasMedia = async (): Promise<MediaStatsResponse> => {
  const response = await axiosConfig.get<MediaStatsResponse>('/media/stats');
  return response.data;
};

/**
 * Lista mídias órfãs (sem usuário)
 */
export const ListarMediaOrfas = async (): Promise<MediaListResponse> => {
  const response = await axiosConfig.get<MediaListResponse>('/media/orphaned');
  return response.data;
};

/**
 * Limpa mídias órfãs antigas
 */
export const LimparMediaOrfas = async (days?: number): Promise<CleanOrphanedResponse> => {
  const response = await axiosConfig.delete<CleanOrphanedResponse>('/media/clean-orphaned', {
    params: { days },
  });
  return response.data;
};

/**
 * Validações e operações auxiliares
 */
export const validarTipoArquivo = (file: File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  return allowedTypes.includes(file.type);
};

export const validarTamanhoArquivo = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const formatarTamanho = (bytes: number): string => {
  if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  }
  return bytes + ' bytes';
};

export const obterTipoMedia = (mimeType: string): MediaType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
  return 'other';
};