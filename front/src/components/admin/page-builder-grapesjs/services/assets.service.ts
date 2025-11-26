// src/components/admin/page-builder-grapesjs/services/assets.service.ts

import { toast } from 'sonner';
import type { GrapesEditor, GrapesAsset } from '../types/grapesjs.types';
import { getAuthToken, getApiUrl } from '../utils/auth.utils';

interface MediaListResponse {
  success: boolean;
  data: {
    data: Array<{
      id: number;
      url: string;
      filename: string;
      title?: string;
      type: string;
    }>;
  };
}

export const loadAssetsFromAPI = async (editor: GrapesEditor): Promise<void> => {
  const token = getAuthToken();
  const apiUrl = getApiUrl();

  if (!token) {
    console.warn('⚠️ Token não encontrado, galeria não será carregada');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/media?type=image&per_page=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: MediaListResponse = await response.json();

    if (result.success && result.data?.data) {
      const assets: GrapesAsset[] = result.data.data.map((media) => ({
        src: media.url,
        name: media.title || media.filename,
        type: 'image' as const,
      }));

      editor.AssetManager.add(assets);
      
      console.log(`✅ ${assets.length} imagens carregadas na galeria`);
    } else {
      console.warn('⚠️ Nenhuma imagem encontrada');
    }
  } catch (error: any) {
    console.error('Erro ao carregar assets:', error);
    toast.error('Erro ao carregar galeria de imagens');
  }
};