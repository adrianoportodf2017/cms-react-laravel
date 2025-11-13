// src/components/admin/page-builder/components/Image.tsx

import React, { useState, useRef, useCallback } from 'react';
import type { ComponentConfig } from '@measured/puck';
import { Upload, Loader2, Trash2, Image as ImageIcon, AlertCircle, Crop, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

// Importa os services de mídia
import { useUploadMedia, useListarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

// Importa os mixins reutilizáveis
import {
    spacingFields,
    dimensionFields,
    visibilityFields,
    styleFields,
    defaultSpacingProps,
    defaultDimensionProps,
    defaultVisibilityProps,
    defaultStyleProps,
    addUnit,
    getVisibilityClasses,
} from '../fields';

export interface ImageProps {
    imageUrl: string;
    altText?: string;
    caption?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    imageWidth?: string; 
    imageHeight?: string;
    imageBorderRadius?: string;
    linkUrl?: string;
    linkTarget?: '_self' | '_blank';
    hiddenMobile?: boolean;
    hiddenTablet?: boolean;
    hiddenDesktop?: boolean;
    margin?: { top?: string; right?: string; bottom?: string; left?: string };
    padding?: { top?: string; right?: string; bottom?: string; left?: string };
    width?: string;
    maxWidth?: string;
    backgroundColor?: string;
    borderRadius?: string;
    zIndex?: string;
    customClasses?: string;
}

/**
 * Helper para criar imagem cropada
 */
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

export const ImageConfig: ComponentConfig<ImageProps> = {
    fields: {
        imageUrl: {
            type: 'custom',
            label: 'Imagem',
            render: ({ value, onChange }) => {
                const [uploading, setUploading] = useState(false);
                const [error, setError] = useState<string | null>(null);
                const [showGallery, setShowGallery] = useState(false);
                const [showCrop, setShowCrop] = useState(false);
                const [cropImage, setCropImage] = useState<string>('');
                const [crop, setCrop] = useState({ x: 0, y: 0 });
                const [zoom, setZoom] = useState(1);
                const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
                const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
                const fileInputRef = useRef<HTMLInputElement>(null);

                const uploadMutation = useUploadMedia();
                const { data: mediaList, isLoading: loadingGallery } = useListarMedia({
                    type: 'image',
                    per_page: 12,
                });

                const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                }, []);

                const handleCropSave = async () => {
                    if (!cropImage || !croppedAreaPixels) return;

                    setUploading(true);
                    setError(null);

                    try {
                        // Cria imagem cropada
                        const croppedBlob = await createCroppedImage(cropImage, croppedAreaPixels);
                        
                        // Converte blob para file
                        const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });

                        // Faz upload
                        const result = await uploadMutation.mutateAsync({
                            file,
                            category: 'page-builder',
                        });

                        if (result.success) {
                            onChange(result.data.url);
                            setShowCrop(false);
                            setCropImage('');
                        } else {
                            setError('Erro ao fazer upload da imagem cropada');
                        }
                    } catch (err: any) {
                        setError('Erro ao processar crop: ' + err.message);
                    } finally {
                        setUploading(false);
                    }
                };

                const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    // Validações
                    if (!validarTipoArquivo(file)) {
                        setError('Tipo de arquivo não permitido. Use: JPG, PNG, GIF, WEBP ou SVG');
                        return;
                    }

                    if (!validarTamanhoArquivo(file, 5)) {
                        setError('Arquivo muito grande. Tamanho máximo: 5MB');
                        return;
                    }

                    // Abre crop editor
                    const reader = new FileReader();
                    reader.onload = () => {
                        setCropImage(reader.result as string);
                        setShowCrop(true);
                    };
                    reader.readAsDataURL(file);
                };

                const handleRemove = () => {
                    onChange('');
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                };

                const handleSelectFromGallery = (url: string) => {
                    onChange(url);
                    setShowGallery(false);
                };

                const handleCropExisting = () => {
                    if (value) {
                        setCropImage(value);
                        setShowCrop(true);
                    }
                };

                return (
                    <div className="space-y-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                        />

                        {/* Modal de Crop */}
                        {showCrop && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                                    {/* Header */}
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

                                    {/* Crop Area */}
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

                                    {/* Controls */}
                                    <div className="p-4 space-y-4 border-t">
                                        {/* Aspect Ratio */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Proporção
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAspectRatio(16 / 9)}
                                                    className={`px-3 py-1 text-sm rounded ${aspectRatio === 16 / 9 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    16:9
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAspectRatio(4 / 3)}
                                                    className={`px-3 py-1 text-sm rounded ${aspectRatio === 4 / 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    4:3
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAspectRatio(1)}
                                                    className={`px-3 py-1 text-sm rounded ${aspectRatio === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    1:1
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAspectRatio(3 / 4)}
                                                    className={`px-3 py-1 text-sm rounded ${aspectRatio === 3 / 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    3:4
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAspectRatio(9 / 16)}
                                                    className={`px-3 py-1 text-sm rounded ${aspectRatio === 9 / 16 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    9:16
                                                </button>
                                            </div>
                                        </div>

                                        {/* Zoom */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
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

                                        {/* Actions */}
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCrop(false);
                                                    setCropImage('');
                                                }}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
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
                                                Salvar Crop
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview ou Upload */}
                        {!value ? (
                            <div className="space-y-2">
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Clique para fazer upload</span>
                                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WEBP, SVG (máx 5MB)</span>
                                        </>
                                    )}
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setShowGallery(!showGallery)}
                                    className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                                >
                                    {showGallery ? 'Fechar Galeria' : 'Escolher da Galeria'}
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={value}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCropExisting}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                        title="Recortar imagem"
                                    >
                                        <Crop className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Remover imagem"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Galeria de Mídias */}
                        {showGallery && (
                            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-96 overflow-y-auto">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Galeria de Imagens</h4>

                                {loadingGallery ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                    </div>
                                ) : mediaList?.data?.data && mediaList.data.data.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {mediaList.data.data.map((media) => (
                                            <button
                                                key={media.id}
                                                type="button"
                                                onClick={() => handleSelectFromGallery(media.url)}
                                                className="relative aspect-square rounded overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                                            >
                                                <img
                                                    src={media.url}
                                                    alt={media.alt_text || media.title || 'Imagem'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        Nenhuma imagem disponível
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Erro */}
                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Campo de URL manual */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ou insira uma URL:
                            </label>
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );
            },
        },

// Adicione este campo no fields, logo após o campo imageUrl:

imageWidth: {
  type: 'custom',
  label: 'Largura da Imagem',
  render: ({ value, onChange }) => {
    const [width, setWidth] = useState<number>(
      value ? parseInt(value) : 100
    );

    const handleChange = (newWidth: number) => {
      setWidth(newWidth);
      onChange(`${newWidth}%`);
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Largura: {width}%
          </label>
          <button
            type="button"
            onClick={() => handleChange(100)}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Reset
          </button>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={width}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>10%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    );
  },
},

imageHeight: {
  type: 'custom',
  label: 'Altura da Imagem',
  render: ({ value, onChange }) => {
    const [isAuto, setIsAuto] = useState(value === 'auto' || !value);
    const [height, setHeight] = useState<number>(
      value && value !== 'auto' ? parseInt(value) : 300
    );

    const handleToggle = (auto: boolean) => {
      setIsAuto(auto);
      if (auto) {
        onChange('auto');
      } else {
        onChange(`${height}px`);
      }
    };

    const handleChange = (newHeight: number) => {
      setHeight(newHeight);
      onChange(`${newHeight}px`);
    };

    return (
      <div className="space-y-3">
        {/* Toggle Auto/Manual */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`flex-1 px-3 py-2 text-sm rounded ${
              isAuto 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`flex-1 px-3 py-2 text-sm rounded ${
              !isAuto 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Manual
          </button>
        </div>

        {/* Slider (apenas se não for auto) */}
        {!isAuto && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Altura: {height}px
              </label>
              <button
                type="button"
                onClick={() => handleChange(300)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Reset
              </button>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="50"
              value={height}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>100px</span>
              <span>400px</span>
              <span>800px</span>
            </div>
          </div>
        )}
      </div>
    );
  },
},


        altText: {
            type: 'text',
            label: 'Texto Alternativo (ALT)',
        },

        caption: {
            type: 'text',
            label: 'Legenda (opcional)',
        },

        // ===== CONFIGURAÇÕES DA IMAGEM =====
        objectFit: {
            type: 'select',
            label: 'Ajuste da Imagem',
            options: [
                { label: 'Cobrir (cover)', value: 'cover' },
                { label: 'Conter (contain)', value: 'contain' },
                { label: 'Preencher (fill)', value: 'fill' },
                { label: 'Nenhum', value: 'none' },
                { label: 'Reduzir (scale-down)', value: 'scale-down' },
            ],
        },

    

        imageBorderRadius: {
            type: 'text',
            label: 'Arredondamento da Imagem (ex: 8px)',
        },

        // ===== LINK =====
        linkUrl: {
            type: 'text',
            label: 'URL do Link (opcional)',
        },

        linkTarget: {
            type: 'radio',
            label: 'Abrir link em',
            options: [
                { label: 'Mesma aba', value: '_self' },
                { label: 'Nova aba', value: '_blank' },
            ],
        },

        // ✨ Campos reutilizáveis
        ...spacingFields,
        ...dimensionFields,
        ...visibilityFields,
        ...styleFields,
    },

    defaultProps: {
        imageUrl: '',
        altText: '',
        caption: '',
        objectFit: 'cover',
           imageWidth: '100%',
        imageHeight: 'auto',
        imageBorderRadius: '8px',
        linkUrl: '',
        linkTarget: '_self',
        ...defaultSpacingProps,
        ...defaultDimensionProps,
        ...defaultVisibilityProps,
        ...defaultStyleProps,
    },

    render: ({
    imageUrl,
    altText,
    caption,
    objectFit,
    imageWidth,  // ✅ Adicione aqui
    imageHeight,
    imageBorderRadius,
    linkUrl,
    linkTarget,
    hiddenMobile,
    hiddenTablet,
    hiddenDesktop,
    margin,
    padding,
    width,
    maxWidth,
    backgroundColor,
    borderRadius,
    zIndex,
    customClasses,
}) => {
    const visibilityClasses = getVisibilityClasses(hiddenMobile, hiddenTablet, hiddenDesktop);

    const imageElement = (
        <div
            className={`image-wrapper ${visibilityClasses} ${customClasses || ''}`}
            style={{
                width,
                maxWidth: maxWidth !== 'none' ? maxWidth : undefined,
                marginTop: addUnit(margin?.top),
                marginRight: addUnit(margin?.right),
                marginBottom: addUnit(margin?.bottom),
                marginLeft: addUnit(margin?.left),
                paddingTop: addUnit(padding?.top),
                paddingRight: addUnit(padding?.right),
                paddingBottom: addUnit(padding?.bottom),
                paddingLeft: addUnit(padding?.left),
                backgroundColor,
                borderRadius: addUnit(borderRadius),
                zIndex: zIndex !== 'auto' ? zIndex : undefined,
            }}
        >
            {imageUrl ? (
                <>
                    <img
                        src={imageUrl}
                        alt={altText || ''}
                        style={{
                            width: imageWidth || '100%',  // ✅ Usa imageWidth
                            height: imageHeight,
                            objectFit: objectFit as any,
                            borderRadius: addUnit(imageBorderRadius),
                            display: 'block',
                            margin: '0 auto',  // ✅ Centraliza se menor que 100%
                        }}
                        loading="lazy"
                    />
                    {caption && (
                        <p className="text-sm text-gray-600 mt-2 text-center italic">
                            {caption}
                        </p>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Nenhuma imagem selecionada</span>
                </div>
            )}
        </div>
    );

    if (linkUrl && imageUrl) {
        return (
            <a
                href={linkUrl}
                target={linkTarget}
                rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
                className="block"
            >
                {imageElement}
            </a>
        );
    }

    return imageElement;
},
};