import { useState, useEffect } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  UploadCloud,
  Archive,
  Copy,
  Star,
  Menu,
  ArrowUpDown,
  FileEdit,
} from 'lucide-react';

interface EditorSidebarProps {
  show: boolean;
  pageId?: string;

  // Status
  status: 'draft' | 'published' | 'archived';

  // Campos básicos
  pageTitle: string;
  setPageTitle: (value: string) => void;
  pageSlug: string;
  setPageSlug: (value: string) => void;

  // Hierarquia
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

  // Handlers
  onClose: () => void;
  onSave: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;

  // Estados
  isSaving?: boolean;
  canPublish?: boolean;
  canArchive?: boolean;
}

/**
 * Gera slug a partir do título
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
};

export const EditorSidebar = ({
  show,
  pageId,
  status,
  pageTitle,
  setPageTitle,
  pageSlug,
  setPageSlug,
  parentId,
  setParentId,
  displayOrder,
  setDisplayOrder,
  inMainMenu,
  setInMainMenu,
  isFeatured,
  setIsFeatured,
  parentOptions,
  onClose,
  onSave,
  onSaveDraft,
  onPublish,
  onArchive,
  onDuplicate,
  isSaving = false,
  canPublish = true,
  canArchive = false,
}: EditorSidebarProps) => {
  const [sections, setSections] = useState({
    info: true,
    publish: true,
    hierarchy: true,
    actions: true,
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Gera slug automaticamente quando o título muda
  useEffect(() => {
    if (!isSlugManuallyEdited && pageTitle) {
      setPageSlug(generateSlug(pageTitle));
    }
  }, [pageTitle, isSlugManuallyEdited, setPageSlug]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setPageSlug(e.target.value);
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto z-50 lg:relative shadow-xl lg:shadow-none flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-gray-900">Configurações</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Seção: Informações Básicas */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('info')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Informações Básicas</h3>
              </div>
              {sections.info ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {sections.info && (
              <div className="p-3 space-y-3 border-t border-gray-200 bg-gray-50">
                {/* Nome da Página */}
                <div>
                  <label
                    htmlFor="page-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome da Página *
                  </label>
                  <input
                    id="page-title"
                    type="text"
                    value={pageTitle}
                    onChange={handleTitleChange}
                    className="w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-200"
                    placeholder="Ex: Página Inicial"
                  />
                </div>

                {/* Slug da Página */}
                <div>
                  <label
                    htmlFor="page-slug"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Slug da Página *
                  </label>
                  <input
                    id="page-slug"
                    type="text"
                    value={pageSlug}
                    onChange={handleSlugChange}
                    className="w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-200"
                    placeholder="Ex: pagina-inicial"
                  />
                  {!isSlugManuallyEdited && pageTitle && (
                    <p className="mt-1 text-xs text-gray-500">
                      Gerado automaticamente
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Seção: Publicar */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('publish')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800">Publicar</h3>
              {sections.publish ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {sections.publish && (
              <div className="p-3 space-y-2 border-t border-gray-200 bg-gray-50">
                {/* Status Badge */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status === 'published'
                      ? 'Publicado'
                      : status === 'draft'
                      ? 'Rascunho'
                      : 'Arquivado'}
                  </span>
                </div>

                {/* Salvar Rascunho */}
                {status !== 'published' && (
                  <button
                    onClick={onSaveDraft}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{pageId ? 'Salvar Rascunho' : 'Criar Rascunho'}</span>
                  </button>
                )}

                {/* Publicar */}
                <button
                  onClick={onPublish}
                  disabled={!canPublish || isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{status === 'published' ? 'Atualizar' : 'Publicar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Seção: Hierarquia */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('hierarchy')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800">Hierarquia</h3>
              {sections.hierarchy ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {sections.hierarchy && (
              <div className="p-3 space-y-3 border-t border-gray-200 bg-gray-50">
                {/* Página Pai */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Página Pai
                  </label>
                  <select
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || null)}
                    className="w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-200"
                  >
                    <option value="">Nenhuma (raiz)</option>
                    {parentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-200"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Menor valor aparece primeiro
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inMainMenu}
                      onChange={(e) => setInMainMenu(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Menu className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Exibir no Menu Principal</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Star className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Página em Destaque</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Seção: Outras Ações */}
          {pageId && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('actions')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">Outras Ações</h3>
                {sections.actions ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {sections.actions && (
                <div className="p-3 space-y-2 border-t border-gray-200 bg-gray-50">
                  {/* Duplicar */}
                  {onDuplicate && (
                    <button
                      onClick={onDuplicate}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicar Página</span>
                    </button>
                  )}

                  {/* Arquivar */}
                  {onArchive && canArchive && (
                    <button
                      onClick={onArchive}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      <span>Arquivar Página</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};