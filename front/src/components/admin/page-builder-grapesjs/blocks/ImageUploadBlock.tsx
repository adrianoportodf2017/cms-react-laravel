// src/components/admin/page-builder-grapes/blocks/ImageUploadBlock.tsx

import React, { useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Loader2, Trash2, Crop, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { toast } from 'sonner';

import { useUploadMedia, useListarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

// Helper para criar imagem cropada
const createCroppedImage = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.95);
    };

    image.onerror = () => reject(new Error('Failed to load image'));
  });
};

// Componente Modal de Upload (exportado para uso no Asset Manager)
export const ImageUploadModalComponent = ({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (url: string, complete?: boolean) => void; 
  onClose: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadMedia();
  const { data: mediaList, isLoading: loadingGallery } = useListarMedia({
    type: 'image',
    per_page: 20,
  });

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return;

    setUploading(true);
    setError(null);

    try {
      const croppedBlob = await createCroppedImage(cropImage, croppedAreaPixels);
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });

      const result = await uploadMutation.mutateAsync({
        file,
        category: 'page-builder',
      });

      if (result.success) {
        onSelect(result.data.url);
        toast.success('✅ Imagem enviada!');
        onClose();
      } else {
        setError('Erro ao fazer upload');
      }
    } catch (err: any) {
      setError('Erro ao processar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUseOriginal = async () => {
    if (!cropImage) return;

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(cropImage);
      const blob = await response.blob();
      const file = new File([blob], 'original-image.jpg', { type: 'image/jpeg' });

      const result = await uploadMutation.mutateAsync({
        file,
        category: 'page-builder',
      });

      if (result.success) {
        onSelect(result.data.url);
        toast.success('✅ Imagem enviada!');
        onClose();
      } else {
        setError('Erro ao fazer upload');
      }
    } catch (err: any) {
      setError('Erro: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validarTipoArquivo(file)) {
      setError('Tipo não permitido. Use: JPG, PNG, GIF, WEBP ou SVG');
      return;
    }

    if (!validarTamanhoArquivo(file, 5)) {
      setError('Arquivo muito grande. Máximo: 5MB');
      return;
    }

    if (file.type === 'image/svg+xml') {
      // SVG: upload direto
      setUploading(true);
      setError(null);

      try {
        const result = await uploadMutation.mutateAsync({
          file,
          category: 'page-builder',
        });

        if (result.success) {
          onSelect(result.data.url);
          toast.success('✅ SVG enviado!');
          onClose();
        } else {
          setError('Erro ao fazer upload');
        }
      } catch (err: any) {
        setError('Erro: ' + err.message);
      } finally {
        setUploading(false);
      }
    } else {
      // Outras imagens: mostrar crop
      setCropImage(URL.createObjectURL(file));
      setShowCrop(true);
    }
  };

  if (showCrop) {
    return (
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Recortar Imagem</h3>
          <button
            type="button"
            onClick={() => {
              setShowCrop(false);
              setCropImage('');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-96 bg-gray-900">
          <Cropper
            image={cropImage}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-4 space-y-4 border-t">
          <div>
            <label className="block text-sm font-medium mb-2">Proporção</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: '16:9', value: 16 / 9 },
                { label: '4:3', value: 4 / 3 },
                { label: '1:1', value: 1 },
                { label: '3:4', value: 3 / 4 },
                { label: 'Livre', value: NaN },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setAspectRatio(item.value)}
                  className={`px-3 py-1 text-sm rounded ${
                    (isNaN(aspectRatio) && isNaN(item.value)) || aspectRatio === item.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Zoom: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-between">
            <button
              type="button"
              onClick={handleUseOriginal}
              disabled={uploading}
              className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded hover:bg-green-50 disabled:opacity-50"
            >
              Usar Original
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCrop(false);
                  setCropImage('');
                }}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={uploading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Aplicar Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Adicionar Imagem</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'gallery'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Galeria
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'upload' ? (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="grapes-image-upload"
            />

            <label
              htmlFor="grapes-image-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              {uploading ? (
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-700">Clique para fazer upload</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP, SVG (máx 5MB)</span>
                </>
              )}
            </label>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            {loadingGallery ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : mediaList?.data?.data && mediaList.data.data.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {mediaList.data.data.map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => {
                      onSelect(media.url);
                      toast.success('✅ Imagem selecionada!');
                      onClose();
                    }}
                    className="relative aspect-square rounded overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group"
                  >
                    <img
                      src={media.url}
                      alt={media.alt_text || media.title || 'Imagem'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Nenhuma imagem disponível</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Função para abrir o modal
export const openImageUploadModal = (editor: any, component: any) => {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4';
  document.body.appendChild(modalContainer);

  const root = createRoot(modalContainer);

  const handleSelect = (url: string) => {
    // CRITICAL: Valida que é URL e não base64
    if (url.startsWith('data:image')) {
      toast.error('Erro: Imagem não foi enviada corretamente');
      return;
    }

    // Atualiza atributos da imagem
    component.set({
      src: url,
      // Remove qualquer base64 anterior
      attributes: {
        ...component.getAttributes(),
        src: url,
      }
    });

    // Força update
    component.view.render();
    
    console.log('✅ Imagem atualizada com URL:', url);
    
    // Fecha o modal
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  root.render(<ImageUploadModalComponent onSelect={handleSelect} onClose={handleClose} />);
};

// Registra o bloco no GrapesJS
export const registerImageUploadBlock = (editor: any) => {
  editor.BlockManager.add('image-upload-cooperforte', {
    label: 'Imagem Upload',
    category: 'Cooperforte',
    media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
    content: {
      type: 'image',
      activeOnRender: 1,
    },
  });

  // Hook: quando clica no componente image, abre o modal
  editor.on('component:selected', (component: any) => {
    if (component.get('type') === 'image') {
      // Adiciona botão "Upload" no toolbar
      const toolbar = component.get('toolbar');
      const hasUploadButton = toolbar.some((btn: any) => btn.id === 'upload-image');
      
      if (!hasUploadButton) {
        component.set('toolbar', [
          ...toolbar,
          {
            id: 'upload-image',
            label: '📤',
            command: () => openImageUploadModal(editor, component),
            attributes: { title: 'Upload/Galeria' },
          },
        ]);
      }
    }
  });
};