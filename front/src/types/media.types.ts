// src/types/media.types.ts

export type MediaType = 'image' | 'video' | 'pdf' | 'document' | 'other';
export type MediaStatus = 'active' | 'inactive' | 'processing';

export interface Media {
  id: number;
  user_id: number | null;
  filename: string;
  path: string;
  url: string;
  size: number;
  size_formatted: string;
  type: MediaType;
  mime_type: string;
  extension: string;
  category: string | null;
  title: string | null;
  description: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  status: MediaStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: {
    id: number;
    Nome: string;
    Email: string;
  };
}

export interface MediaResponse {
  success: boolean;
  message?: string;
  data: Media;
}

export interface MediaListResponse {
  success: boolean;
  data: {
    data: Media[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface UploadMediaDto {
  file: File;
  category?: string;
  title?: string;
  description?: string;
  alt_text?: string;
}

export interface UpdateMediaDto {
  category?: string;
  title?: string;
  description?: string;
  alt_text?: string;
  status?: MediaStatus;
}

export interface MediaStatsResponse {
  success: boolean;
  data: {
    total: number;
    by_type: Record<MediaType, number>;
    total_size: number;
    total_size_formatted: string;
  };
}

export interface CleanOrphanedResponse {
  success: boolean;
  message: string;
  count: number;
}