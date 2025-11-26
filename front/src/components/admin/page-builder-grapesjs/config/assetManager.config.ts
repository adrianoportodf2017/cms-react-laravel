// src/components/admin/page-builder-grapesjs/config/assetManager.config.ts

import type { Editor, Asset } from 'grapesjs';
import type { Media } from '../../../../types/media.types';
import type { GrapesJSAssetProps } from '../types/editor.types';

interface AssetManagerConfig {
  uploadMedia: (file: File) => Promise<any>;
  fetchMedia: () => Promise<Media[]>;
  deleteMedia: (id: number) => Promise<void>;
  validateFile: (file: File) => boolean;
  validateSize: (file: File) => boolean;
}

export const convertMediaToAssets = (mediaList: Media[]): GrapesJSAssetProps[] => {
  return mediaList
    .filter(media => media.type === 'image')
    .map(media => ({
      src: media.url, // ✅ URL completa do backend
      type: 'image',
      name: media.title || media.filename,
      id: String(media.id),
      height: media.height || undefined,
      width: media.width || undefined,
    }));
};

export const setupAssetManager = (
  editor: Editor,
  config: AssetManagerConfig
): void => {
  if (!editor?.AssetManager) return;

  const assetManager = editor.AssetManager;

  console.log('🔧 Configurando Asset Manager customizado...');

  // ✅ INTERCEPTA quando um asset é adicionado
  editor.on('asset:add', (asset: Asset) => {
    console.log('➕ Asset adicionado:', asset.get('src'));
    
    // ✅ Garante que sempre use URL, nunca base64
    const src = asset.get('src');
    if (src && src.startsWith('data:')) {
      console.warn('⚠️ Tentativa de adicionar base64 bloqueada');
      // Remove o asset com base64
      assetManager.remove(asset);
    }
  });

  // ✅ INTERCEPTA a seleção de assets
  editor.on('asset:custom', (props: any) => {
    console.log('🎯 Asset custom event:', props);
  });

  // Carrega mídias ao abrir
  editor.on('asset:open', async () => {
    console.log('📂 Carregando mídias do backend...');
    
    try {
      const mediaList = await config.fetchMedia();
      const assets = convertMediaToAssets(mediaList);
      
      assetManager.getAll().reset();
      assets.forEach(asset => assetManager.add(asset));
      
      console.log(`✅ ${assets.length} mídias carregadas`);
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
    }
  });

  // Remove do backend
  editor.on('asset:remove', async (asset: Asset) => {
    const assetId = asset.get('id');
    if (assetId && assetId !== 'undefined') {
      try {
        await config.deleteMedia(Number(assetId));
        console.log('✅ Mídia deletada do backend');
      } catch (error) {
        console.error('❌ Erro ao deletar:', error);
      }
    }
  });

  console.log('✅ Asset Manager configurado');
};

export const setupCustomUploader = (
  editor: Editor,
  uploadFn: (file: File) => Promise<any>,
  validateFile: (file: File) => boolean,
  validateSize: (file: File) => boolean
): void => {
  if (!editor?.Commands) return;

  console.log('🔧 Configurando uploader customizado...');

  // Adiciona handler de upload ao abrir Asset Manager
  editor.on('run:open-assets', () => {
    setTimeout(() => {
      addUploadButton(editor, uploadFn, validateFile, validateSize);
    }, 200);
  });

  console.log('✅ Uploader customizado configurado');
};

function addUploadButton(
  editor: Editor,
  uploadFn: (file: File) => Promise<any>,
  validateFile: (file: File) => boolean,
  validateSize: (file: File) => boolean
) {
  const container = editor.AssetManager.getContainer();
  const header = container?.querySelector('.gjs-am-assets-header');
  
  if (!header || header.querySelector('.custom-upload-btn')) return;
  
  const btn = document.createElement('button');
  btn.className = 'custom-upload-btn gjs-btn-prim';
  btn.innerHTML = '📤 Enviar Imagem';
  btn.style.cssText = `
    margin-left: 10px;
    padding: 8px 16px;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
  `;
  
  btn.onmouseenter = () => {
    btn.style.background = '#4338ca';
  };
  
  btn.onmouseleave = () => {
    btn.style.background = '#4f46e5';
  };
  
  btn.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    input.multiple = true;
    
    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      btn.disabled = true;
      btn.innerHTML = '⏳ Enviando...';
      
      let successCount = 0;
      
      for (const file of Array.from(files)) {
        if (!validateFile(file) || !validateSize(file)) continue;
        
        try {
          console.log('📤 Enviando:', file.name);
          
          const response = await uploadFn(file);
          const media = response.data;
          
          console.log('✅ Backend retornou:', media.url);
          
          // ✅ Adiciona com URL do backend
          editor.AssetManager.add({
            src: media.url,
            type: 'image',
            name: media.title || media.filename,
            id: String(media.id),
            height: media.height,
            width: media.width,
          });
          
          successCount++;
          console.log(`✅ Upload concluído: ${media.filename}`);
          
        } catch (error) {
          console.error('❌ Erro:', error);
        }
      }
      
      btn.disabled = false;
      btn.innerHTML = '📤 Enviar Imagem';
      
      if (successCount > 0) {
        alert(`✅ ${successCount} arquivo(s) enviado(s)!`);
      }
    };
    
    input.click();
  };
  
  header.appendChild(btn);
}