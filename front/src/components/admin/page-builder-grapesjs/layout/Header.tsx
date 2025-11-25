
import type { EditorHeaderProps } from '../types/builder.types';

export const EditorHeader = ({
  pageTitle,
  status,
  isEditorReady,
  onBack,
  onSave,
  onToggleSidebar,
}: EditorHeaderProps) => {
    
  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          ← Voltar
        </button>
        <div>
          <h1 className="text-xl font-bold">{pageTitle || 'Nova Página'}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{status}</span>
            {!isEditorReady && (
              <span className="text-xs text-yellow-600">Carregando editor...</span>
            )}
            {isEditorReady && (
              <span className="text-xs text-green-600">✓ Editor pronto</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={!isEditorReady}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isEditorReady ? '💾 Salvar' : 'Carregando...'}
        </button>
        <button onClick={onToggleSidebar} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          ⚙️
        </button>
      </div>
    </div>
  );
};