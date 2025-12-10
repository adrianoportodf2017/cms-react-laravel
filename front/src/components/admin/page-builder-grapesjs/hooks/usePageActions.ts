// hooks/usePageActions.ts
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { GrapesJSEditor } from '../types/editor.types';
import {
  useSalvarPagina,
  useAtualizarPagina,
  usePublicarPagina,
  useArquivarPagina,
  useDuplicarPagina,
} from '../../../../services/pages';

interface UsePageActionsProps {
  id?: string;
  editorRef: React.MutableRefObject<GrapesJSEditor | null>;
  isEditorReady: boolean;
  pageTitle: string;
  pageSlug: string;
  status: 'draft' | 'published' | 'archived';
  setStatus: (value: 'draft' | 'published' | 'archived') => void;
  isFeatured: boolean;
  displayOrder: number;
  inMainMenu: boolean;
  parentId: string | null;
}

/**
 * Hook para gerenciar todas as ações da página
 */
export const usePageActions = ({
  id,
  editorRef,
  isEditorReady,
  pageTitle,
  pageSlug,
  status,
  setStatus,
  isFeatured,
  displayOrder,
  inMainMenu,
  parentId,
}: UsePageActionsProps) => {
  const navigate = useNavigate();
  const salvarPagina = useSalvarPagina();
  const atualizarPagina = useAtualizarPagina();
  const publicarPagina = usePublicarPagina();
  const arquivarPagina = useArquivarPagina();
  const duplicarPagina = useDuplicarPagina();

  /**
   * Build payload para salvar
   */
  const buildPayload = (overrideStatus?: 'draft' | 'published' | 'archived') => {
    const editor = editorRef.current;
    if (!editor) throw new Error('Editor não disponível');

    const html = editor.getHtml();
    const css = editor.getCss();
    const projectData = editor.getProjectData();

    const components = projectData.pages?.[0]?.frames?.[0]?.component?.components || [];
    const styles = projectData.styles || [];

    return {
      name: pageTitle,
      slug: pageSlug,
      status: overrideStatus || status,
      content: {
        html: html + (css ? `<style>${css}</style>` : ''),
        css,
        grapes: { components, styles },
      },
      is_featured: isFeatured,
      display_order: displayOrder,
      in_main_menu: inMainMenu,
      parent_id: parentId,
    };
  };

  /**
   * Validações básicas
   */
  const validate = () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Preencha nome e slug!');
      return false;
    }

    if (!editorRef.current || !isEditorReady) {
      toast.error('Editor não está pronto');
      return false;
    }

    return true;
  };

  /**
   * Salvar (mantém status atual)
   */
  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload();

      if (id) {
        await atualizarPagina.mutateAsync({ id, data: payload });
        toast.success('✅ Página atualizada!');
      } else {
        const res = await salvarPagina.mutateAsync(payload);
        toast.success('✅ Página criada!');
        navigate(`/admin/grapes-builder/${res.data.id}`);
      }
    } catch (err: any) {
      console.error('❌ Erro:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar');
    }
  };

  /**
   * Salvar como rascunho
   */
  const handleSaveDraft = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload('draft');

      if (id) {
        await atualizarPagina.mutateAsync({ id, data: payload });
        setStatus('draft');
        toast.success('✅ Rascunho salvo!');
      } else {
        const res = await salvarPagina.mutateAsync(payload);
        toast.success('✅ Rascunho criado!');
        navigate(`/admin/grapes-builder/${res.data.id}`);
      }
    } catch (err: any) {
      console.error('❌ Erro:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar rascunho');
    }
  };

  /**
   * Publicar
   */
  const handlePublish = async () => {
    if (!validate()) return;

    if (!id) {
      // Cria como publicado
      try {
        const payload = buildPayload('published');
        const res = await salvarPagina.mutateAsync(payload);
        toast.success('✅ Página publicada!');
        navigate(`/admin/grapes-builder/${res.data.id}`);
      } catch (err: any) {
        console.error('❌ Erro:', err);
        toast.error(err?.response?.data?.message || 'Erro ao publicar');
      }
    } else {
      // Atualiza status para published
      try {
        await handleSave(); // Salva primeiro
        await publicarPagina.mutateAsync(id);
        setStatus('published');
        toast.success('✅ Página publicada!');
      } catch (err: any) {
        console.error('❌ Erro:', err);
        toast.error(err?.response?.data?.message || 'Erro ao publicar');
      }
    }
  };

  /**
   * Arquivar
   */
  const handleArchive = async () => {
    if (!id) return;

    try {
      await arquivarPagina.mutateAsync(id);
      setStatus('archived');
      toast.success('✅ Página arquivada!');
    } catch (err: any) {
      console.error('❌ Erro:', err);
      toast.error(err?.response?.data?.message || 'Erro ao arquivar');
    }
  };

  /**
   * Duplicar
   */
  const handleDuplicate = async () => {
    if (!id) return;

    try {
      const res = await duplicarPagina.mutateAsync(id);
      toast.success('✅ Página duplicada!');
      navigate(`/admin/grapes-builder/${res.data.id}`);
    } catch (err: any) {
      console.error('❌ Erro:', err);
      toast.error(err?.response?.data?.message || 'Erro ao duplicar');
    }
  };

  return {
    handleSave,
    handleSaveDraft,
    handlePublish,
    handleArchive,
    handleDuplicate,
    isSaving: salvarPagina.isPending || atualizarPagina.isPending,
  };
};