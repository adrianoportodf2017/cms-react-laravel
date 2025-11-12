/**
 * Componente RichText com Editor Visual TipTap
 * Versão simplificada sem conflitos de dependências
 */

import { useEffect } from 'react';
import type { ComponentConfig } from '@measured/puck';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Code,
  Quote,
  Undo,
  Redo,
  Palette,
  Minus,
  Pilcrow,
  RemoveFormatting
} from 'lucide-react';
import type { StyleControls } from '../types/style-controls.types';
import { generateStyleClasses, generateInlineStyles } from '../utils/styleHelper';

/**
 * Props do RichText
 */
export interface RichTextProps extends StyleControls {
  id: string;
  content: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

/**
 * Toolbar do Editor
 */
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const insertHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm rounded-t-lg sticky top-0 z-10">
      <div className="flex flex-wrap items-center gap-1">
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Negrito (Ctrl+B)"
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Itálico (Ctrl+I)"
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Sublinhado (Ctrl+U)"
            type="button"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Tachado"
            type="button"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-orange-100 text-orange-700' : 'text-gray-600'
            }`}
            title="Título 1"
            type="button"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-orange-100 text-orange-700' : 'text-gray-600'
            }`}
            title="Título 2"
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-orange-100 text-orange-700' : 'text-gray-600'
            }`}
            title="Título 3"
            type="button"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('paragraph') ? 'bg-gray-100' : 'text-gray-600'
            }`}
            title="Parágrafo"
            type="button"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-green-50 hover:text-green-600 transition-colors ${
              editor.isActive('bulletList') ? 'bg-green-100 text-green-700' : 'text-gray-600'
            }`}
            title="Lista com marcadores"
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-green-50 hover:text-green-600 transition-colors ${
              editor.isActive('orderedList') ? 'bg-green-100 text-green-700' : 'text-gray-600'
            }`}
            title="Lista numerada"
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Alinhar à esquerda"
            type="button"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Centralizar"
            type="button"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Alinhar à direita"
            type="button"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Justificar"
            type="button"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Inserir link"
            type="button"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors"
            title="Inserir imagem"
            type="button"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Special Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            className={`p-2 rounded hover:bg-yellow-50 hover:text-yellow-600 transition-colors ${
              editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'
            }`}
            title="Destacar texto"
            type="button"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('code') ? 'bg-gray-200' : 'text-gray-600'
            }`}
            title="Código inline"
            type="button"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-200' : 'text-gray-600'
            }`}
            title="Citação"
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
              title="Cor do texto"
              type="button"
            >
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1">
                {['#000000', '#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed', '#db2777'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Desfazer (Ctrl+Z)"
            type="button"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Refazer (Ctrl+Y)"
            type="button"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={insertHorizontalRule}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Linha horizontal"
            type="button"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={clearFormatting}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Limpar formatação"
            type="button"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Custom Field - Editor Visual
 */
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  // @ts-ignore - Conflito de versões do TipTap resolvido ignorando
  const editor = useEditor({
    extensions: [
      // @ts-ignore
      StarterKit.configure({
        history: {
          depth: 100,
        },
      }),
      // @ts-ignore
      Underline,
      // @ts-ignore
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // @ts-ignore
      Highlight.configure({
        multicolor: true,
      }),
      // @ts-ignore
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      // @ts-ignore
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      // @ts-ignore
      TextStyle,
      // @ts-ignore
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  });

  // Atualiza o editor quando o valor externo muda
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent 
        editor={editor}
        className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto
                   prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-h1:text-4xl prose-h1:mb-4
                   prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
                   prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-gray-900 prose-strong:font-semibold
                   prose-ul:list-disc prose-ul:pl-6
                   prose-ol:list-decimal prose-ol:pl-6
                   prose-li:mb-2
                   prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                   prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                   prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 
                   prose-code:rounded prose-code:text-sm prose-code:text-red-600
                   prose-img:rounded-lg prose-img:shadow-md
                   prose-hr:border-gray-300 prose-hr:my-8
                   [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[350px]"
      />
    </div>
  );
};

/**
 * Configuração do RichText para o Puck
 */
export const RichTextConfig: ComponentConfig<RichTextProps> = {
  fields: {
    id: {
      type: 'text',
      label: 'ID do Componente',
    },
    
    // ===== EDITOR VISUAL - CUSTOM FIELD =====
    content: {
      type: 'custom',
      label: 'Conteúdo',
      render: ({ value, onChange }) => (
        <RichTextEditor value={value || ''} onChange={onChange} />
      ),
    },
    
    // ===== LARGURA =====
    maxWidth: {
      type: 'select',
      label: 'Largura Máxima',
      options: [
        { label: 'Pequena (640px)', value: 'sm' },
        { label: 'Média (768px)', value: 'md' },
        { label: 'Grande (1024px)', value: 'lg' },
        { label: 'Extra Grande (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
        { label: 'Completa', value: 'full' },
      ],
    },
    
    margin: {
      type: 'object',
      label: 'Margens',
      objectFields: {
        top: {
          type: 'select',
          label: 'Margem Superior',
          options: [
            { label: '0', value: '0' },
            { label: '4', value: '4' },
            { label: '8', value: '8' },
            { label: '12', value: '12' },
          ],
        },
        bottom: {
          type: 'select',
          label: 'Margem Inferior',
          options: [
            { label: '0', value: '0' },
            { label: '4', value: '4' },
            { label: '8', value: '8' },
            { label: '12', value: '12' },
          ],
        },
      },
    },
    
    padding: {
      type: 'object',
      label: 'Paddings',
      objectFields: {
        top: {
          type: 'select',
          label: 'Padding Superior',
          options: [
            { label: '0', value: '0' },
            { label: '4', value: '4' },
            { label: '8', value: '8' },
            { label: '12', value: '12' },
          ],
        },
        bottom: {
          type: 'select',
          label: 'Padding Inferior',
          options: [
            { label: '0', value: '0' },
            { label: '4', value: '4' },
            { label: '8', value: '8' },
            { label: '12', value: '12' },
          ],
        },
      },
    },
  },
  
  defaultProps: {
    id: '',
    content: '<h2>Título do Artigo</h2><p>Escreva seu conteúdo aqui. Você pode usar <strong>negrito</strong>, <em>itálico</em>, e muito mais!</p>',
    maxWidth: '2xl',
    margin: { top: '0', bottom: '0' },
    padding: { top: '8', bottom: '8' },
  },
  
  render: (props) => {
    const {
      content,
      maxWidth,
      ...styleProps
    } = props;
    
    // Gera classes de estilo
    const styleClasses = generateStyleClasses(styleProps as StyleControls);
    const inlineStyles = generateInlineStyles(styleProps as StyleControls);
    
    // Classes de largura máxima
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      full: 'max-w-full',
    };
    
    // Classes do container
    const containerClasses = [
      'container mx-auto px-4',
      maxWidth !== 'full' ? maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] : '',
      maxWidth !== 'full' ? 'mx-auto' : '',
      styleClasses,
    ].filter(Boolean).join(' ');
    
    return (
      <div className={containerClasses} style={inlineStyles}>
        <div 
          className="prose prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-gray-900
                     prose-h1:text-4xl prose-h1:mb-4
                     prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
                     prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
                     prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                     prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-gray-900 prose-strong:font-semibold
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                     prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                     prose-li:mb-2
                     prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                     prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                     prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 
                     prose-code:rounded prose-code:text-sm prose-code:text-red-600
                     prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 
                     prose-pre:rounded-lg prose-pre:overflow-x-auto
                     prose-img:rounded-lg prose-img:shadow-md
                     prose-hr:border-gray-300 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  },
};