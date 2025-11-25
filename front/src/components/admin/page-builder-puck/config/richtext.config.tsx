// src/components/admin/page-builder/components/RichText.tsx

import React, { useEffect, useRef } from 'react';
import type { ComponentConfig } from '@measured/puck';
import 'quill/dist/quill.snow.css';

// Importa os mixins reutilizáveis
import {
  typographyFields,
  spacingFields,
  dimensionFields,
  visibilityFields,
  styleFields,
  defaultTypographyProps,
  defaultSpacingProps,
  defaultDimensionProps,
  defaultVisibilityProps,
  defaultStyleProps,
  addUnit,
  getVisibilityClasses,
  generateResponsiveStyles,
} from '../fields';

export interface RichTextProps {
  content: string;
  fontSize?: string;
  fontSizeMobile?: string;
  alignment?: string;
  alignmentMobile?: string;
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

export const RichTextConfig: ComponentConfig<RichTextProps> = {
  fields: {
    // Campo específico do RichText
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
                '#000000', '#FFFFFF',
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
                placeholder: 'Digite seu conteúdo aqui...',
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
            <div ref={editorRef} style={{ minHeight: '300px' }} />
          </div>
        );
      }
    },
    
    // ✨ Campos reutilizáveis
    ...typographyFields,
    ...spacingFields,
    ...dimensionFields,
    ...visibilityFields,
    ...styleFields,
  },
  
  defaultProps: {
    content: '<p>Escreva seu conteúdo aqui...</p>',
    ...defaultTypographyProps,
    ...defaultSpacingProps,
    ...defaultDimensionProps,
    ...defaultVisibilityProps,
    ...defaultStyleProps,
  },
  
  render: ({ 
    content, 
    fontSize,
    fontSizeMobile,
    alignment,
    alignmentMobile,
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
    const uniqueId = `richtext-${content.substring(0, 10).replace(/[^a-z0-9]/gi, '')}`;

    return (
      <>
        <style>{generateResponsiveStyles(uniqueId, fontSize!, fontSizeMobile!, alignment!, alignmentMobile!)}</style>

        <div className={`container mx-auto  ${visibilityClasses}`}>
          <div 
            className={`${uniqueId} ' ' ${customClasses || ''}`}
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
            <div className="richtext-content">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </>
    );
  },
};