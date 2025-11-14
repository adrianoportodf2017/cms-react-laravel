// src/pageBuilder/extensions/Text.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 're-resizable';
import 'quill/dist/quill.snow.css';
import { RESIZABLE_HANDLES } from '../utils/resizable';
import { snapCssSize } from '../utils/grid';
import type { TextProps } from '../types/blocks';

export const Text: React.FC<TextProps> & { craft?: any } = ({
  text = '<p>Clique para editar</p>',
  width = 'auto',
  height = 'auto',
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializa o Quill quando entra em modo de edição
  useEffect(() => {
    if (!isEditing || !editorRef.current) return;
    if (quillInstanceRef.current) return;

    const existingQuill = editorRef.current.querySelector('.ql-container');
    if (existingQuill) return;

    const initEditor = async () => {
      try {
        const Quill = (await import('quill')).default;
        if (quillInstanceRef.current) return;

        const tailwindColors = [
          '#000000', '#FFFFFF',
          '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280',
          '#4B5563', '#374151', '#1F2937', '#111827',
          '#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6',
          '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
          '#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E',
          '#16A34A', '#15803D', '#166534', '#14532D',
          '#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444',
          '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
          '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308',
          '#CA8A04', '#A16207', '#854D0E', '#713F12',
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

        // Define o conteúdo inicial
        if (text && text !== '<p><br></p>') {
          quillInstanceRef.current.root.innerHTML = text;
        }

        // Atualiza o texto quando o editor muda
        quillInstanceRef.current.on('text-change', () => {
          const html = quillInstanceRef.current.root.innerHTML;
          setProp((props: any) => {
            props.text = html;
          });
        });

        // Foca no editor
        quillInstanceRef.current.focus();
      } catch (error) {
        console.error('Erro ao inicializar Quill:', error);
      }
    };

    const timer = setTimeout(initEditor, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [isEditing]);

  // Limpa o Quill quando sai do modo de edição
  useEffect(() => {
    if (!isEditing && quillInstanceRef.current) {
      quillInstanceRef.current.off('text-change');
      const toolbar = containerRef.current?.querySelector('.ql-toolbar');
      if (toolbar) toolbar.remove();
      quillInstanceRef.current = null;
      
      // Limpa o editor
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [isEditing]);

  return (
    <Resizable
      size={{ width, height }}
      onResizeStop={(e, direction, ref) => {
        const rawWidth = ref.style.width;
        const rawHeight = ref.style.height;

        setProp((props: any) => {
          props.width = snapCssSize(rawWidth);
          props.height = snapCssSize(rawHeight);
        });
      }}
      enable={selected && !isEditing ? RESIZABLE_HANDLES : {}}
    >
      <div
        ref={(ref: any) => ref && connect(drag(ref))}
        className={`relative ${selected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
        style={{
          background: 'white',
          cursor: isEditing ? 'text' : 'move',
          outline: 'none',
          height: '100%',
        }}
      >
        {/* Modo Edição */}
        {isEditing ? (
          <div
            ref={containerRef}
            className="rich-text-editor-container"
            style={{ height: '100%' }}
          >
            <div 
              ref={editorRef} 
              style={{ 
                minHeight: height === 'auto' ? '300px' : height,
                height: '100%'
              }} 
            />
          </div>
        ) : (
          // Modo Preview
          <div
            onClick={() => {
              if (selected) {
                setIsEditing(true);
              }
            }}
            className="p-4 cursor-pointer"
            style={{
              minHeight: '100px',
              height: '100%',
            }}
          >
            {/* Renderiza o HTML do Quill */}
            <div
              className="richtext-content ql-editor"
              dangerouslySetInnerHTML={{ __html: text }}
              style={{
                padding: 0,
                border: 'none',
              }}
            />

            {/* Overlay quando selecionado mas não editando */}
            {selected && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-blue-50 bg-opacity-10">
                <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded shadow">
                  Clique para editar
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Resizable>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: '<p>Clique para editar</p>',
    width: 'auto',
    height: 'auto',
  },
  rules: {
    canDrag: () => true,
  },
};