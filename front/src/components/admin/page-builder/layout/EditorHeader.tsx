import React from 'react';
import { ArrowLeft, Eye, Code, Move, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type PageStatus = 'draft' | 'published' | 'archived';

interface EditorHeaderProps {
  // exibição
  status: PageStatus;
  isEditMode?: boolean;
  titleOverride?: string;
  authorName?: string | null;

  // toggles de UI
  showPreview: boolean;
  showCodeEditor: boolean;
  showOutline: boolean;
  onToggleCodeEditor: () => void;
  onTogglePreview: () => void;
  onToggleOutline: () => void;
  onAddTailwindBlock: () => void;
}

const statusLabel: Record<PageStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
};

const statusColor: Record<PageStatus, string> = {
  draft: 'text-yellow-700 bg-yellow-100 border-yellow-200',
  published: 'text-green-700 bg-green-100 border-green-200',
  archived: 'text-gray-700 bg-gray-100 border-gray-200',
};

const btn =
  'inline-flex items-center gap-2 rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50';
const btnSm = 'px-3 py-1.5 text-sm';
const btnGhost = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
const btnDark = 'bg-gray-900 text-white border-gray-900 hover:bg-black';
const btnPrimary = 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700';

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  status,
  isEditMode = false,
  titleOverride,
  authorName,
  showPreview,
  showCodeEditor,
  showOutline,
  onToggleCodeEditor,
  onTogglePreview,
  onToggleOutline,
  onAddTailwindBlock,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* título e status */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/admin/pages')}
              className={`${btn} ${btnGhost} ${btnSm}`}
              aria-label="Voltar para a lista de páginas"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {titleOverride ?? (isEditMode ? 'Editar Página' : 'Nova Página')}
                </h1>
                <span className={`text-xs px-2 py-1 rounded-full border ${statusColor[status]}`}>
                  {statusLabel[status]}
                </span>
                {authorName && (
                  <span className="text-xs px-2 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                    Autor: {authorName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* toggles principais */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAddTailwindBlock}
              className={`${btn} ${btnDark} ${btnSm}`}
              title="Inserir blocos prontos em Tailwind"
            >
              <Palette className="w-4 h-4" />
              Blocos
            </button>
            <button
              onClick={onToggleOutline}
              className={`${btn} ${btnGhost} ${btnSm} ${showOutline ? 'ring-2 ring-blue-200' : ''}`}
              title="Mostrar/Ocultar Outline + Drag & Drop"
            >
              <Move className="w-4 h-4" />
              {showOutline ? 'Arrastar' : 'Outline'}
            </button>
            <button
              onClick={onToggleCodeEditor}
              className={`${btn} ${showCodeEditor ? btnDark : btnGhost} ${btnSm}`}
            >
              <Code className="w-4 h-4" />
              {showCodeEditor ? 'Visual' : 'Código'}
            </button>
            <button
              onClick={onTogglePreview}
              className={`${btn} ${showPreview ? btnPrimary : btnGhost} ${btnSm}`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Editar' : 'Preview'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
