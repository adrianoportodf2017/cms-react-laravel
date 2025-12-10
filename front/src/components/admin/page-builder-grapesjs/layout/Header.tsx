import { ArrowLeft, Save, Settings } from 'lucide-react';

interface EditorHeaderProps {
  pageTitle: string;
  pageId?: string;
  status: 'draft' | 'published' | 'archived';
  isEditorReady: boolean;
  isSaving?: boolean;
  authorName?: string;
  showSidebar: boolean;
  onBack: () => void;
  onSave: () => void;
  onToggleSidebar: () => void;
}

const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
};

export const EditorHeader = ({
  pageTitle,
  pageId,
  status,
  isEditorReady,
  isSaving = false,
  authorName,
  showSidebar,
  onBack,
  onSave,
  onToggleSidebar,
}: EditorHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Back + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Páginas</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {pageId ? 'Editar' : 'Nova Página'}
            </span>
          </div>

          {/* Title + Status */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {pageTitle || 'Página sem título'}
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>

          {/* Author (opcional) */}
          {authorName && (
            <p className="text-xs text-gray-500 mt-0.5">
              Por {authorName}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={!isEditorReady || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>

        {/* Settings Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors ${
            showSidebar
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          aria-label="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};