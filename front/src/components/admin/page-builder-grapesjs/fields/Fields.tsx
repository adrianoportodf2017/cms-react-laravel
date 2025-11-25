import type { EditorFieldsProps } from '../types/builder.types';


export const EditorFields = ({
  pageTitle,
  pageSlug,
  onPageTitleChange,
  onPageSlugChange,
}: EditorFieldsProps) => {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="grid grid-cols-2 gap-4 max-w-4xl">
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => onPageTitleChange(e.target.value)}
          placeholder="Nome da página"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          value={pageSlug}
          onChange={(e) => onPageSlugChange(e.target.value)}
          placeholder="slug-da-pagina"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};