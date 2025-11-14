// src/components/admin/page-builder/components/Dropdown.tsx

import React, { useEffect, useRef } from 'react';
import type { ComponentConfig } from '@measured/puck';
import { ChevronDown, ChevronRight } from 'lucide-react';
import 'quill/dist/quill.snow.css';

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

export interface DropdownProps {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // HTML do RichText
  
  // Configurações
  defaultOpen?: boolean;
  iconPosition?: 'left' | 'right';
  
  // Estilos do header
  headerPadding?: string;
  headerBackground?: string;
  headerBorderRadius?: string;
  
  // Estilos do conteúdo
  contentPadding?: string;
  
  // Animação
  animationSpeed?: 'fast' | 'normal' | 'slow';
  
  // Props dos mixins
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

export const DropdownConfig: ComponentConfig<DropdownProps> = {
  fields: {
    id: {
      type: 'text',
      label: 'ID do Componente',
    },
    
    // ===== CONTEÚDO =====
    title: {
      type: 'text',
      label: 'Título',
    },
    
    subtitle: {
      type: 'text',
      label: 'Subtítulo (opcional)',
    },
    
    content: {
      type: 'custom',
      label: 'Conteúdo',
      render: ({ value, onChange }) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const quillInstanceRef = useRef<any>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        
        useEffect(() => {
          if (!editorRef.current) return;
          if (quillInstanceRef.current) return;
          
          const existingQuill = editorRef.current.querySelector('.ql-container');
          if (existingQuill) return;
          
          const initEditor = async () => {
            try {
              const Quill = (await import('quill')).default;
              if (quillInstanceRef.current) return;
              
              const tailwindColors = [
                'transparent', '#FFFFFF', '#000000',
                '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827',
                '#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
                '#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D',
                '#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
                '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12',
                '#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE', '#6B21A8', '#581C87',
                '#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843',
                '#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12',
              ];
              
              const toolbarOptions = [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': tailwindColors }, { 'background': tailwindColors }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['blockquote', 'code-block'],
                ['clean']
              ];
              
              quillInstanceRef.current = new Quill(editorRef.current!, {
                theme: 'snow',
                placeholder: 'Digite o conteúdo do dropdown aqui...',
                modules: { toolbar: toolbarOptions },
              });
              
              if (value && value !== '<p><br></p>') {
                quillInstanceRef.current.root.innerHTML = value;
              }
              
              quillInstanceRef.current.on('text-change', () => {
                const html = quillInstanceRef.current.root.innerHTML;
                onChange(html);
              });
            } catch (error) {
              console.error('Erro ao inicializar Quill:', error);
            }
          };
          
          const timer = setTimeout(initEditor, 50);
          
          return () => {
            clearTimeout(timer);
            if (quillInstanceRef.current) {
              quillInstanceRef.current.off('text-change');
              const toolbar = containerRef.current?.querySelector('.ql-toolbar');
              if (toolbar) toolbar.remove();
              quillInstanceRef.current = null;
            }
          };
        }, []);
        
        return (
          <div ref={containerRef} className="rich-text-editor-container border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div ref={editorRef} style={{ minHeight: '200px' }} />
          </div>
        );
      }
    },
    
    // ===== CONFIGURAÇÕES =====
    defaultOpen: {
      type: 'radio',
      label: 'Aberto por padrão',
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
      ],
    },
    
    iconPosition: {
      type: 'radio',
      label: 'Posição do Ícone',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Direita', value: 'right' },
      ],
    },
    
    animationSpeed: {
      type: 'select',
      label: 'Velocidade da Animação',
      options: [
        { label: 'Rápido', value: 'fast' },
        { label: 'Normal', value: 'normal' },
        { label: 'Lento', value: 'slow' },
      ],
    },
    
    // ===== ESTILOS DO HEADER =====
    headerPadding: {
      type: 'text',
      label: 'Padding do Header (ex: 16px)',
    },
    
    headerBackground: {
      type: 'text',
      label: 'Background do Header (ex: #F3F4F6)',
    },
    
    headerBorderRadius: {
      type: 'text',
      label: 'Arredondamento do Header (ex: 8px)',
    },
    
    // ===== ESTILOS DO CONTEÚDO =====
    contentPadding: {
      type: 'text',
      label: 'Padding do Conteúdo (ex: 16px)',
    },
    
    // ✨ Campos reutilizáveis
    ...spacingFields,
    ...dimensionFields,
    ...visibilityFields,
    ...styleFields,
  },
  
  defaultProps: {
    id: '',
    title: 'Clique para expandir',
    subtitle: 'Mais informações aqui',
    content: '<p>Este é o conteúdo que aparece quando você clica. Você pode usar <strong>negrito</strong>, <em>itálico</em>, listas e muito mais!</p>',
    defaultOpen: false,
    iconPosition: 'right',
    animationSpeed: 'normal',
    headerPadding: '16px',
    headerBackground: '#F3F4F6',
    headerBorderRadius: '8px',
    contentPadding: '16px',
    ...defaultSpacingProps,
    ...defaultDimensionProps,
    ...defaultVisibilityProps,
    ...defaultStyleProps,
  },
  
  render: (props) => {
    const {
      id,
      title,
      subtitle,
      content,
      defaultOpen,
      iconPosition,
      animationSpeed,
      headerPadding,
      headerBackground,
      headerBorderRadius,
      contentPadding,
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
    
    // Gera ID único se não fornecido
    const dropdownId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    
    // Classes de visibilidade responsiva
    const visibilityClasses = getVisibilityClasses(hiddenMobile, hiddenTablet, hiddenDesktop);
    
    // Velocidades de animação
    const animationSpeeds = {
      fast: 'duration-150',
      normal: 'duration-300',
      slow: 'duration-500',
    };
    
    const animationClass = animationSpeeds[animationSpeed || 'normal'];
    
    return (
      <div 
        className={`dropdown-wrapper overflow-hidden ${visibilityClasses} ${customClasses || ''}`}
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
        {/* Header - Clicável */}
        <button
          data-dropdown-trigger={dropdownId}
          className={`dropdown-trigger w-full flex items-center ${iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse justify-between'} gap-3 hover:opacity-80 transition-colors cursor-pointer text-left`}
          style={{
            padding: addUnit(headerPadding),
            backgroundColor: headerBackground,
            borderRadius: addUnit(headerBorderRadius),
          }}
          type="button"
        >
          {/* Ícone */}
          <div 
            data-dropdown-icon={dropdownId}
            className={`dropdown-icon flex-shrink-0 transition-transform ${animationClass}`}
          >
            {iconPosition === 'left' ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          {/* Textos */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </button>
        
        {/* Conteúdo - Expansível */}
        <div 
          data-dropdown-content={dropdownId}
          data-dropdown-open="false"
          data-dropdown-default-open={defaultOpen ? 'true' : 'false'}
          className={`dropdown-content overflow-hidden transition-all ${animationClass}`}
        >
          <div 
            className="border-t border-gray-200"
            style={{ padding: addUnit(contentPadding) }}
          >
            {/* RichText Content */}
            <div className="richtext-content">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};