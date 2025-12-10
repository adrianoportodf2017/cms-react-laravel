// hooks/useParentPages.ts
import { useEffect, useState } from 'react';
import { useListarPaginas } from '../../../../services/pages';

/**
 * Hook para carregar e gerenciar opções de páginas pai
 */
export const useParentPages = (currentPageId?: string) => {
  const [parentOptions, setParentOptions] = useState<Array<{ value: string; label: string }>>([]);

  const { data: pagesListData } = useListarPaginas({
    status: 'published',
    per_page: 100,
    page: 1,
  });

  useEffect(() => {
    if (pagesListData?.data) {
      const opts = pagesListData.data
        .filter((p: any) => !currentPageId || p.id !== currentPageId) // Exclui a própria página
        .map((p: any) => ({
          value: p.id,
          label: `${p.name} (${p.slug})`,
        }));
      setParentOptions(opts);
    }
  }, [pagesListData, currentPageId]);

  return { parentOptions };
};