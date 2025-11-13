// src/components/admin/page-builder/layout/Sidebar.tsx
import React from 'react';
import {
  Save,
  UploadCloud,
  Archive,
  Copy,
  Star,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';

export type PageStatus = 'draft' | 'published' | 'archived';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Estado da página
  status: PageStatus;
  pageId?: string;
  
  // Campos de hierarquia
  parentId: string | null;
  setParentId: (value: string | null) => void;
  displayOrder: number;
  setDisplayOrder: (value: number) => void;
  inMainMenu: boolean;
  setInMainMenu: (value: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
  
  // Opções
  parentOptions: Array<{ value: string; label: string }>;
  
  // Handlers de ações
  onSave: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  
  // Estados de loading
  isSaving: boolean;
  canPublish: boolean;
  canArchive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  pageId,
  parentId,
  setParentId,
  displayOrder,
  setDisplayOrder,
  inMainMenu,
  setInMainMenu,
  isFeatured,
  setIsFeatured,
  parentOptions,
  onSave,
  onSaveDraft,
  onPublish,
  onArchive,
  onDuplicate,
  isSaving,
  canPublish,
  canArchive,
}) => {
  const [sidebarSection, setSidebarSection] = React.useState({
    publicar: true,
    hierarquia: true,
    outras: true
  });

  if (!isOpen) return null;
  

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto z-50 lg:relative shadow-xl lg:shadow-none">
        {/* Header do Sidebar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Configurações</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Fechar configurações"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          
          {/* Seção: Publicar */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setSidebarSection({...sidebarSection, publicar: !sidebarSection.publicar})}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800">Publicar</h3>
              {sidebarSection.publicar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {sidebarSection.publicar && (
              <div className="p-3 pt-0 space-y-2">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Salvando...' : (pageId ? 'Salvar alterações' : 'Salvar página')}
                </button>

                <button
                  onClick={onSaveDraft}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar como rascunho
                </button>

                <button
                  onClick={onPublish}
                  disabled={!canPublish || isSaving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Publicar
                </button>

                <button
                  onClick={onArchive}
                  disabled={!canArchive || isSaving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Arquivar
                </button>
              </div>
            )}
          </div>

          {/* Seção: Hierarquia */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setSidebarSection({...sidebarSection, hierarquia: !sidebarSection.hierarquia})}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800">Hierarquia</h3>
              {sidebarSection.hierarquia ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {sidebarSection.hierarquia && (
              <div className="p-3 pt-0 space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Página Pai</label>
                  <select
                    value={parentId ?? ''}
                    onChange={(e) => setParentId(e.target.value || null)}
                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-sm"
                  >
                    <option value="">— Sem pai (nível raiz) —</option>
                    {parentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Posição no Menu</label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value || '0', 10))}
                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inMainMenu}
                    onChange={(e) => setInMainMenu(e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  Exibir no menu principal
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 border-amber-300 rounded"
                  />
                  <Star className="w-4 h-4 text-amber-500" />
                  Marcar como destaque
                </label>
              </div>
            )}
          </div>

          {/* Seção: Outras Ações */}
          {pageId && (
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setSidebarSection({...sidebarSection, outras: !sidebarSection.outras})}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">Outras Ações</h3>
                {sidebarSection.outras ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {sidebarSection.outras && (
                <div className="p-3 pt-0">
                  <button
                    onClick={onDuplicate}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Duplicar Página
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dica */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
            <div className="font-semibold mb-1">💡 Dica</div>
            Arraste componentes do painel esquerdo para criar sua página!
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;