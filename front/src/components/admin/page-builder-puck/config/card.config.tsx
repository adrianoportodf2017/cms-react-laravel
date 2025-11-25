// src/components/admin/page-builder/components/Card.tsx

import React, { useState, useRef } from 'react';
import type { ComponentConfig } from '@measured/puck';
import { Upload, Loader2, Trash2, AlertCircle } from 'lucide-react';

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

export interface CardProps {
    // Imagem
    imageUrl?: string;
    imagePosition?: 'top' | 'left' | 'right' | 'background';
    imageHeight?: string;
    imageObjectFit?: 'contain' | 'cover' | 'fill' | 'none';
    showImage?: boolean;
    
    // Logo/Ícone
    logoUrl?: string;
    logoSize?: string;
    logoPosition?: 'top' | 'bottom' | 'left' | 'right';
    showLogo?: boolean;
    
    // Conteúdo
    title?: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    titleColor?: string;
    titleSize?: string;
    
    subtitle?: string;
    subtitleColor?: string;
    subtitleSize?: string;
    
    description?: string;
    descriptionColor?: string;
    descriptionSize?: string;
    
    // Botão
    buttonText?: string;
    buttonUrl?: string;
    buttonTarget?: '_self' | '_blank';
    buttonStyle?: 'primary' | 'secondary' | 'outline' | 'ghost';
    showButton?: boolean;
    
    // Layout
    contentAlignment?: 'left' | 'center' | 'right';
    cardLayout?: 'vertical' | 'horizontal';
    
    // Estilo do Card
    cardBackgroundColor?: string;
    cardBorderRadius?: string;
    cardBorderWidth?: string;
    cardBorderColor?: string;
    cardShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    cardHoverEffect?: boolean;
    
    // Campos reutilizáveis
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

export const CardConfig: ComponentConfig<CardProps> = {
    fields: {
        // ========== SEÇÃO: IMAGEM PRINCIPAL ==========
        showImage: {
            type: 'radio',
            label: 'Exibir Imagem Principal',
            options: [
                { label: 'Sim', value: true },
                { label: 'Não', value: false },
            ],
        },

        imageUrl: {
            type: 'custom',
            label: 'Imagem Principal',
            render: ({ value, onChange }) => {
                const [uploading, setUploading] = useState(false);
                const [error, setError] = useState<string | null>(null);
                const [showGallery, setShowGallery] = useState(false);
                const fileInputRef = useRef<HTMLInputElement>(null);

                const uploadMutation = useUploadMedia();
                const { data: mediaList, isLoading: loadingGallery } = useListarMedia({
                    type: 'image',
                    per_page: 12,
                });

                const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (!validarTipoArquivo(file)) {
                        setError('Tipo de arquivo não permitido. Use: JPG, PNG, GIF, WEBP ou SVG');
                        return;
                    }

                    if (!validarTamanhoArquivo(file, 5)) {
                        setError('Arquivo muito grande. Tamanho máximo: 5MB');
                        return;
                    }

                    setUploading(true);
                    setError(null);

                    try {
                        const result = await uploadMutation.mutateAsync({
                            file,
                            category: 'page-builder',
                        });

                        if (result.success) {
                            onChange(result.data.url);
                        } else {
                            setError('Erro ao fazer upload da imagem');
                        }
                    } catch (err: any) {
                        setError('Erro ao fazer upload: ' + err.message);
                    } finally {
                        setUploading(false);
                    }
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

                return (
                    <div className="space-y-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="card-image-upload"
                        />

                        {!value ? (
                            <div className="space-y-2">
                                <label
                                    htmlFor="card-image-upload"
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
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    title="Remover imagem"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {showGallery && (
                            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
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

                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },

        imagePosition: {
            type: 'radio',
            label: 'Posição da Imagem',
            options: [
                { label: 'Topo', value: 'top' },
                { label: 'Esquerda', value: 'left' },
                { label: 'Direita', value: 'right' },
                { label: 'Fundo', value: 'background' },
            ],
        },

        imageHeight: {
            type: 'text',
            label: 'Altura da Imagem (ex: 200px, 50%)',
        },

        imageObjectFit: {
            type: 'select',
            label: 'Ajuste da Imagem',
            options: [
                { label: 'Cobrir (cover)', value: 'cover' },
                { label: 'Conter (contain)', value: 'contain' },
                { label: 'Preencher (fill)', value: 'fill' },
                { label: 'Nenhum', value: 'none' },
            ],
        },

        // ========== SEÇÃO: LOGO/ÍCONE ==========
        showLogo: {
            type: 'radio',
            label: 'Exibir Logo/Ícone',
            options: [
                { label: 'Sim', value: true },
                { label: 'Não', value: false },
            ],
        },

        logoUrl: {
            type: 'custom',
            label: 'Logo/Ícone',
            render: ({ value, onChange }) => {
                const [uploading, setUploading] = useState(false);
                const [error, setError] = useState<string | null>(null);
                const [showGallery, setShowGallery] = useState(false);
                const fileInputRef = useRef<HTMLInputElement>(null);

                const uploadMutation = useUploadMedia();
                const { data: mediaList, isLoading: loadingGallery } = useListarMedia({
                    type: 'image',
                    per_page: 12,
                });

                const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (!validarTipoArquivo(file)) {
                        setError('Tipo de arquivo não permitido. Use: JPG, PNG, GIF, WEBP ou SVG');
                        return;
                    }

                    if (!validarTamanhoArquivo(file, 5)) {
                        setError('Arquivo muito grande. Tamanho máximo: 5MB');
                        return;
                    }

                    setUploading(true);
                    setError(null);

                    try {
                        const result = await uploadMutation.mutateAsync({
                            file,
                            category: 'page-builder',
                        });

                        if (result.success) {
                            onChange(result.data.url);
                        } else {
                            setError('Erro ao fazer upload do logo');
                        }
                    } catch (err: any) {
                        setError('Erro ao fazer upload: ' + err.message);
                    } finally {
                        setUploading(false);
                    }
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

                return (
                    <div className="space-y-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="card-logo-upload"
                        />

                        {!value ? (
                            <div className="space-y-2">
                                <label
                                    htmlFor="card-logo-upload"
                                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Clique para fazer upload</span>
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
                                    alt="Logo Preview"
                                    className="w-full h-20 object-contain rounded-lg bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    title="Remover logo"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {showGallery && (
                            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
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

                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },

        logoSize: {
            type: 'text',
            label: 'Tamanho do Logo (ex: 80px, 100px)',
        },

        logoPosition: {
            type: 'radio',
            label: 'Posição do Logo',
            options: [
                { label: 'Topo', value: 'top' },
                { label: 'Fundo', value: 'bottom' },
                { label: 'Esquerda', value: 'left' },
                { label: 'Direita', value: 'right' },
            ],
        },

        // ========== SEÇÃO: CONTEÚDO ==========
        title: {
            type: 'text',
            label: 'Título',
        },

        titleTag: {
            type: 'select',
            label: 'Tag do Título',
            options: [
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
            ],
        },

        titleColor: {
            type: 'text',
            label: 'Cor do Título (ex: #000000)',
        },

        titleSize: {
            type: 'text',
            label: 'Tamanho do Título (ex: 24px, 1.5rem)',
        },

        subtitle: {
            type: 'text',
            label: 'Subtítulo',
        },

        subtitleColor: {
            type: 'text',
            label: 'Cor do Subtítulo (ex: #666666)',
        },

        subtitleSize: {
            type: 'text',
            label: 'Tamanho do Subtítulo (ex: 16px, 1rem)',
        },

        description: {
            type: 'textarea',
            label: 'Descrição',
        },

        descriptionColor: {
            type: 'text',
            label: 'Cor da Descrição (ex: #666666)',
        },

        descriptionSize: {
            type: 'text',
            label: 'Tamanho da Descrição (ex: 14px, 0.875rem)',
        },

        // ========== SEÇÃO: BOTÃO ==========
        showButton: {
            type: 'radio',
            label: 'Exibir Botão',
            options: [
                { label: 'Sim', value: true },
                { label: 'Não', value: false },
            ],
        },

        buttonText: {
            type: 'text',
            label: 'Texto do Botão',
        },

        buttonUrl: {
            type: 'text',
            label: 'URL do Botão',
        },

        buttonTarget: {
            type: 'radio',
            label: 'Abrir botão em',
            options: [
                { label: 'Mesma aba', value: '_self' },
                { label: 'Nova aba', value: '_blank' },
            ],
        },

        buttonStyle: {
            type: 'select',
            label: 'Estilo do Botão',
            options: [
                { label: 'Primary (Azul)', value: 'primary' },
                { label: 'Secondary (Cinza)', value: 'secondary' },
                { label: 'Outline (Contorno)', value: 'outline' },
                { label: 'Ghost (Transparente)', value: 'ghost' },
            ],
        },

        // ========== SEÇÃO: LAYOUT ==========
        contentAlignment: {
            type: 'radio',
            label: 'Alinhamento do Conteúdo',
            options: [
                { label: 'Esquerda', value: 'left' },
                { label: 'Centro', value: 'center' },
                { label: 'Direita', value: 'right' },
            ],
        },

        cardLayout: {
            type: 'radio',
            label: 'Layout do Card',
            options: [
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
            ],
        },

        // ========== SEÇÃO: ESTILO DO CARD ==========
        cardBackgroundColor: {
            type: 'text',
            label: 'Cor de Fundo do Card (ex: #ffffff)',
        },

        cardBorderRadius: {
            type: 'text',
            label: 'Arredondamento (ex: 8px, 1rem)',
        },

        cardBorderWidth: {
            type: 'text',
            label: 'Largura da Borda (ex: 1px, 2px)',
        },

        cardBorderColor: {
            type: 'text',
            label: 'Cor da Borda (ex: #e5e7eb)',
        },

        cardShadow: {
            type: 'select',
            label: 'Sombra do Card',
            options: [
                { label: 'Nenhuma', value: 'none' },
                { label: 'Pequena', value: 'sm' },
                { label: 'Média', value: 'md' },
                { label: 'Grande', value: 'lg' },
                { label: 'Extra Grande', value: 'xl' },
            ],
        },

        cardHoverEffect: {
            type: 'radio',
            label: 'Efeito ao passar o mouse',
            options: [
                { label: 'Sim', value: true },
                { label: 'Não', value: false },
            ],
        },

        // Campos reutilizáveis
        ...spacingFields,
        ...dimensionFields,
        ...visibilityFields,
        ...styleFields,
    },

    defaultProps: {
        // Imagem
        showImage: true,
        imageUrl: '',
        imagePosition: 'top',
        imageHeight: '200px',
        imageObjectFit: 'cover',
        
        // Logo
        showLogo: true,
        logoUrl: '',
        logoSize: '80px',
        logoPosition: 'top',
        
        // Conteúdo
        title: 'Instituto COOPERFORTE',
        titleTag: 'h3',
        titleColor: '#1f2937',
        titleSize: '20px',
        
        subtitle: '',
        subtitleColor: '#6b7280',
        subtitleSize: '16px',
        
        description: 'Associação para Promoção Humana e Desenvolvimento Social.',
        descriptionColor: '#6b7280',
        descriptionSize: '14px',
        
        // Botão
        showButton: false,
        buttonText: 'Saiba Mais',
        buttonUrl: '#',
        buttonTarget: '_self',
        buttonStyle: 'primary',
        
        // Layout
        contentAlignment: 'center',
        cardLayout: 'vertical',
        
        // Estilo
        cardBackgroundColor: '#f3f4f6',
        cardBorderRadius: '12px',
        cardBorderWidth: '0px',
        cardBorderColor: '#e5e7eb',
        cardShadow: 'sm',
        cardHoverEffect: true,
        
        ...defaultSpacingProps,
        ...defaultDimensionProps,
        ...defaultVisibilityProps,
        ...defaultStyleProps,
    },

    render: (props) => {
        const {
            // Imagem
            showImage,
            imageUrl,
            imagePosition,
            imageHeight,
            imageObjectFit,
            
            // Logo
            showLogo,
            logoUrl,
            logoSize,
            logoPosition,
            
            // Conteúdo
            title,
            titleTag: TitleTag = 'h3',
            titleColor,
            titleSize,
            subtitle,
            subtitleColor,
            subtitleSize,
            description,
            descriptionColor,
            descriptionSize,
            
            // Botão
            showButton,
            buttonText,
            buttonUrl,
            buttonTarget,
            buttonStyle,
            
            // Layout
            contentAlignment,
            cardLayout,
            
            // Estilo
            cardBackgroundColor,
            cardBorderRadius,
            cardBorderWidth,
            cardBorderColor,
            cardShadow,
            cardHoverEffect,
            
            // Campos reutilizáveis
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
        } = props;

        const visibilityClasses = getVisibilityClasses(hiddenMobile, hiddenTablet, hiddenDesktop);

        // Classes de sombra
        const shadowClasses = {
            none: '',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
        };

        // Classes de estilo do botão
        const buttonClasses = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
            ghost: 'text-blue-600 hover:bg-blue-50',
        };

        // Alinhamento
        const alignmentClasses = {
            left: 'text-left items-start',
            center: 'text-center items-center',
            right: 'text-right items-end',
        };

        // Layout do card (vertical ou horizontal)
        const isHorizontal = cardLayout === 'horizontal';
        const layoutClasses = isHorizontal ? 'flex-row' : 'flex-col';

        return (
            <div
                className={`card-wrapper ${visibilityClasses} ${customClasses || ''}`}
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
                <div
                    className={`card overflow-hidden flex ${layoutClasses} ${shadowClasses[cardShadow || 'sm']} ${
                        cardHoverEffect ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''
                    }`}
                    style={{
                        backgroundColor: cardBackgroundColor,
                        borderRadius: addUnit(cardBorderRadius),
                        borderWidth: addUnit(cardBorderWidth),
                        borderColor: cardBorderColor,
                        borderStyle: cardBorderWidth && cardBorderWidth !== '0px' ? 'solid' : 'none',
                        position: imagePosition === 'background' ? 'relative' : undefined,
                    }}
                >
                    {/* Imagem de Fundo */}
                    {showImage && imageUrl && imagePosition === 'background' && (
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: imageObjectFit,
                                backgroundPosition: 'center',
                                opacity: 0.2,
                            }}
                        />
                    )}

                    {/* Imagem Principal (Top, Left, Right) */}
                    {showImage && imageUrl && imagePosition !== 'background' && (
                        <div
                            className={`card-image ${isHorizontal ? 'w-1/3' : 'w-full'}`}
                            style={{
                                height: !isHorizontal ? imageHeight : 'auto',
                                minHeight: isHorizontal ? '200px' : undefined,
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={title || ''}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: imageObjectFit as any,
                                }}
                            />
                        </div>
                    )}

                    {/* Conteúdo do Card */}
                    <div
                        className={`card-content p-6 flex flex-col ${alignmentClasses[contentAlignment || 'center']} ${
                            isHorizontal ? 'flex-1' : 'w-full'
                        }`}
                        style={{
                            position: imagePosition === 'background' ? 'relative' : undefined,
                            zIndex: imagePosition === 'background' ? 1 : undefined,
                        }}
                    >
                        {/* Logo (Topo ou Esquerda) */}
                        {showLogo && logoUrl && (logoPosition === 'top' || logoPosition === 'left') && (
                            <div className="card-logo mb-4">
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    style={{
                                        width: logoSize,
                                        height: 'auto',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        )}

                        {/* Título */}
                        {title && (
                            <TitleTag
                                className="card-title font-bold mb-2"
                                style={{
                                    color: titleColor,
                                    fontSize: titleSize,
                                }}
                            >
                                {title}
                            </TitleTag>
                        )}

                        {/* Subtítulo */}
                        {subtitle && (
                            <p
                                className="card-subtitle mb-3"
                                style={{
                                    color: subtitleColor,
                                    fontSize: subtitleSize,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}

                        {/* Descrição */}
                        {description && (
                            <p
                                className="card-description mb-4"
                                style={{
                                    color: descriptionColor,
                                    fontSize: descriptionSize,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {description}
                            </p>
                        )}

                        {/* Logo (Fundo ou Direita) */}
                        {showLogo && logoUrl && (logoPosition === 'bottom' || logoPosition === 'right') && (
                            <div className="card-logo mt-4">
                                <img
                                    src={logoUrl}
                                    alt="Logo"
                                    style={{
                                        width: logoSize,
                                        height: 'auto',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        )}

                        {/* Botão */}
                        {showButton && buttonText && buttonUrl && (
                            <a
                                href={buttonUrl}
                                target={buttonTarget}
                                rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                                className={`card-button inline-block px-6 py-3 rounded-lg font-medium transition-colors mt-4 ${
                                    buttonClasses[buttonStyle || 'primary']
                                }`}
                            >
                                {buttonText}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    },
};