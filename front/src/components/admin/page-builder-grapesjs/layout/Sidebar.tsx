import type { EditorSidebarProps } from '../types/builder.types';

export const EditorSidebar = ({
  show,
  inMainMenu,
  isFeatured,
  displayOrder,
  status,
  onClose,
  onInMainMenuChange,
  onIsFeaturedChange,
  onDisplayOrderChange,
  onStatusChange,
}: EditorSidebarProps) => {
  if (!show) return null;

  return (
    <div className="w-80 bg-white border-l p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Configurações</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inMainMenu}
            onChange={(e) => onInMainMenuChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Menu Principal</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => onIsFeaturedChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Destaque</span>
        </label>

        <div>
          <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => onDisplayOrderChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
      </div>
    </div>
  );
};