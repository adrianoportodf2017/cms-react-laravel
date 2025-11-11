import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
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
  Link,
  Image,
  Highlighter,
  Code,
  Quote,
  Undo,
  Redo,
  Superscript,
  Subscript,
  Palette,
  Table,
  Minus,
  Pilcrow,
  RemoveFormatting
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  onAddImage: () => void;
  onSetLink: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onAddImage,
  onSetLink,
}) => {
  const addTable = () => {
    (editor as any).chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
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
    <div className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Negrito (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Itálico (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Sublinhado (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Tachado"
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
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-orange-100 text-orange-700' : 'text-gray-600'
            }`}
            title="Título 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-orange-100 text-orange-700' : 'text-gray-600'
            }`}
            title="Título 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('paragraph') ? 'bg-gray-100' : 'text-gray-600'
            }`}
            title="Parágrafo"
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
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-green-50 hover:text-green-600 transition-colors ${
              editor.isActive('orderedList') ? 'bg-green-100 text-green-700' : 'text-gray-600'
            }`}
            title="Lista numerada"
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
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Centralizar"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Alinhar à direita"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
            }`}
            title="Justificar"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={onSetLink}
            className={`p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
            title="Inserir link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={onAddImage}
            className="p-2 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors"
            title="Inserir imagem"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            onClick={addTable}
            className="p-2 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors"
            title="Inserir tabela"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>

        {/* Special Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleMark('highlight', { color: '#fef08a' }).run()}
            className={`p-2 rounded hover:bg-yellow-50 hover:text-yellow-600 transition-colors ${
              editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'
            }`}
            title="Destacar texto"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('code') ? 'bg-gray-200' : 'text-gray-600'
            }`}
            title="Código inline"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-gray-200' : 'text-gray-600'
            }`}
            title="Bloco de código"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-200' : 'text-gray-600'
            }`}
            title="Citação"
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
            >
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1">
                {['#000000', '#dc2626', '#ea580c', '#16a34a', '#2563eb', '#7c3aed', '#db2777'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
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
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={insertHorizontalRule}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Linha horizontal"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={clearFormatting}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Limpar formatação"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};