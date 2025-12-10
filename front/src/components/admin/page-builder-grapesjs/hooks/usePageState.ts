// hooks/usePageState.ts
import { useState, useEffect } from 'react';
import { useObterPaginaPorId } from '../../../../services/pages';

interface PageStateReturn {
  // Estados básicos
  pageTitle: string;
  setPageTitle: (value: string) => void;
  pageSlug: string;
  setPageSlug: (value: string) => void;
  status: 'draft' | 'published' | 'archived';
  setStatus: (value: 'draft' | 'published' | 'archived') => void;

  // Hierarquia
  parentId: string | null;
  setParentId: (value: string | null) => void;
  displayOrder: number;
  setDisplayOrder: (value: number) => void;
  inMainMenu: boolean;
  setInMainMenu: (value: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;

  // Loading
  isLoading: boolean;
  pageData: any;
}

/**
 * Hook para gerenciar todos os estados relacionados à página
 */
export const usePageState = (id?: string): PageStateReturn => {
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [parentId, setParentId] = useState<string | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [inMainMenu, setInMainMenu] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const { data: pageData, isLoading } = useObterPaginaPorId(id || '', !!id);

  // Carrega dados quando a página é buscada
  useEffect(() => {
    if (pageData?.data) {
      const page = pageData.data;
      setPageTitle(page.name);
      setPageSlug(page.slug);
      setStatus(page.status);
      setInMainMenu(!!page.in_main_menu);
      setDisplayOrder(page.display_order || 0);
      setIsFeatured(!!page.is_featured);
      setParentId(page.parent_id || null);
    }
  }, [pageData]);

  return {
    pageTitle,
    setPageTitle,
    pageSlug,
    setPageSlug,
    status,
    setStatus,
    parentId,
    setParentId,
    displayOrder,
    setDisplayOrder,
    inMainMenu,
    setInMainMenu,
    isFeatured,
    setIsFeatured,
    isLoading,
    pageData,
  };
};