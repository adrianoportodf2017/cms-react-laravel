// src/components/admin/page-builder/index.tsx (refatorado)
import { useEffect, useState } from 'react';
import { Puck, Render, type Data } from '@measured/puck';
import { renderToString } from 'react-dom/server';
import '@measured/puck/puck.css';
import { puckConfig, initialData } from './config';
import { 
  useSalvarPagina, 
  useAtualizarPagina, 
  useObterPaginaPorId,
  usePublicarPagina,
  useArquivarPagina,
  useDuplicarPagina,
  useListarPaginas
} from '../../../services/pages';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import type { PuckData } from '../../../types/page-builder.types';
import { convertToPuckData, convertFromPuckData } from '../../../types/page-builder.types';
import { EditorHeader } from './layout/EditorHeader';
import { Sidebar } from './layout/Sidebar';

/**
 * Gera slug a partir do nome
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Gera HTML a partir dos dados do Puck
 */
const generateHtml = (puckData: PuckData): string => {
  try {   
    const html = renderToString(
      <Render config={puckConfig} data={convertFromPuckData(puckData)} />
    );
    return html;
  } catch (error) {
    console.error('Erro ao gerar HTML:', error);
    return '';
  }
};

// Normaliza dados da API para PuckData
const normalizePuckData = (data: any): PuckData => {
  if (!data) return initialData;
  
  return {
    root: {
      props: {
        title: data.root?.props?.title || '',
        ...data.root?.props
      }
    },
    content: Array.isArray(data.content) ? data.content : [],
    zones: typeof data.zones === 'object' ? data.zones : {}
  };
};

export const PageBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [puckData, setPuckData] = useState<PuckData>(initialData);
  const [puckKey, setPuckKey] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
  // Novos campos
  const [inMainMenu, setInMainMenu] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  
  // Opções
  const [parentOptions, setParentOptions] = useState<Array<{ value: string; label: string }>>([]);
  
  // UI
  const [showSidebar, setShowSidebar] = useState(false);

  // Hooks de mutation
  const salvarPagina = useSalvarPagina();
  const atualizarPagina = useAtualizarPagina();
  const publicarPagina = usePublicarPagina();
  const arquivarPagina = useArquivarPagina();
  const duplicarPagina = useDuplicarPagina();
  const { data: pageData, isLoading } = useObterPaginaPorId(id || '', !!id);
  const { data: pagesListData } = useListarPaginas({
    status: 'published',
    per_page: 100,
    page: 1
  });

  // Carrega opções de página pai
  useEffect(() => {
    if (pagesListData?.data) {
      const opts = pagesListData.data
        .filter((p: any) => !id || p.id !== id)
        .map((p: any) => ({ value: p.id, label: `${p.name} (${p.slug})` }));
      setParentOptions(opts);
    }
  }, [pagesListData, id]);

  // Carrega dados da página
  useEffect(() => {
    if (pageData?.data) {
      const page = pageData.data;
      setPageTitle(page.name);
      setPageSlug(page.slug);
      setStatus(page.status);
      setIsSlugManuallyEdited(true);
      
      // Campos extras
      setInMainMenu(Boolean(page.in_main_menu));
      setDisplayOrder(typeof page.display_order === 'number' ? page.display_order : 0);
      setIsFeatured(Boolean(page.is_featured));
      setCategoryId(page.category_id ?? null);
      setParentId(page.parent_id ?? null);
      
      if (page.content?.puck) {
        const normalizedPuckData = normalizePuckData(page.content.puck);
        setPuckData(normalizedPuckData);
        setPuckKey(prev => prev + 1);
      }
      
      if (page.content?.html) {
        setHtmlCode(page.content.html);
      }
    }
  }, [pageData]);

  // Atualiza HTML quando Puck muda
  useEffect(() => {
    const html = generateHtml(puckData);
    setHtmlCode(html);
  }, [puckData]);

  // Handler para nome - gera slug automaticamente
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPageTitle(name);
    if (!isSlugManuallyEdited) {
      setPageSlug(generateSlug(name));
    }
  };

  // Handler para slug - marca como editado manualmente
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageSlug(e.target.value);
    setIsSlugManuallyEdited(true);
  };

  // Handler para mudanças no Puck
  const handlePuckChange = (data: Data) => {
    setPuckData(convertToPuckData(data));
  };

  // Build payload
  const buildPayload = (override?: any) => ({
    name: pageTitle,
    slug: pageSlug,
    status,
    category_id: categoryId ?? undefined,
    is_featured: isFeatured,
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    in_main_menu: inMainMenu,
    parent_id: parentId ?? undefined,
    content: {
      html: htmlCode,
      puck: puckData,
    },
    ...override,
  });

  // Handlers de ações
  const handleSave = async () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Preencha o nome e o slug da página!');
      return;
    }

    try {
      if (id) {
        await atualizarPagina.mutateAsync({ id, data: buildPayload() });
        toast.success('Página atualizada com sucesso!');
      } else {
        const response = await salvarPagina.mutateAsync(buildPayload());
        toast.success('Página criada com sucesso!');
        navigate(`/admin/page-builder/${response.data.id}`);
      }
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(error?.response?.data?.message || 'Erro ao salvar página');
    }
  };

  const handleSaveDraft = async () => {
    try {
      const payload = buildPayload({ status: 'draft' });
      
      if (id) {
        await atualizarPagina.mutateAsync({ id, data: payload });
        toast.success('Rascunho salvo com sucesso!');
      } else {
        const response = await salvarPagina.mutateAsync(payload);
        toast.success('Rascunho criado com sucesso!');
        navigate(`/admin/page-builder/${response.data.id}`);
      }
    } catch (error: any) {
      console.error('Erro ao salvar rascunho:', error);
      toast.error(error?.response?.data?.message || 'Erro ao salvar rascunho');
    }
  };

  const handlePublish = async () => {
    if (!id) {
      toast.error('Salve a página antes de publicar!');
      return;
    }

    try {
      await publicarPagina.mutateAsync(id);
      setStatus('published');
      toast.success('🚀 Página publicada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao publicar:', error);
      toast.error('Erro ao publicar página');
    }
  };

  const handleArchive = async () => {
    if (!id) {
      toast.error('Salve a página antes de arquivar!');
      return;
    }

    try {
      await arquivarPagina.mutateAsync(id);
      setStatus('archived');
      toast.success('📦 Página arquivada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao arquivar:', error);
      toast.error('Erro ao arquivar página');
    }
  };

  const handleDuplicate = async () => {
    if (!id) {
      toast.error('Abra uma página existente para duplicar!');
      return;
    }

    try {
      await duplicarPagina.mutateAsync(id);
      toast.success('📄 Página duplicada como rascunho!');
      navigate('/admin/pages');
    } catch (error: any) {
      console.error('Erro ao duplicar:', error);
      toast.error('Erro ao duplicar página');
    }
  };

  const canPublish = status !== 'published';
  const canArchive = status === 'published';
  const isSaving = salvarPagina.isPending || atualizarPagina.isPending;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando página...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <EditorHeader
        status={status}
        isEditMode={!!id}
        titleOverride={pageTitle}
        authorName={pageData?.data?.author_name}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden flex">
        {/* Área do Editor */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-6">
              
              {/* Campos Nome/Slug */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Página
                    </label>
                    <input
                      type="text"
                      value={pageTitle}
                      onChange={handleNameChange}
                      className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      placeholder="Ex: Página Inicial"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug da Página
                    </label>
                    <input
                      type="text"
                      value={pageSlug}
                      onChange={handleSlugChange}
                      className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      placeholder="Ex: pagina-inicial"
                    />
                    {!isSlugManuallyEdited && (
                      <p className="mt-1 text-xs text-gray-500">
                        🤖 Gerado automaticamente do nome
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor Puck */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Puck
                  key={puckKey}
                  config={puckConfig}
                  data={convertFromPuckData(puckData)}
                  onPublish={handleSave}
                  onChange={handlePuckChange}
                  headerTitle={pageTitle}
                
                  
                />
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar de Configurações */}
        <Sidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          status={status}
          pageId={id}
          parentId={parentId}
          setParentId={setParentId}
          displayOrder={displayOrder}
          setDisplayOrder={setDisplayOrder}
          inMainMenu={inMainMenu}
          setInMainMenu={setInMainMenu}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          parentOptions={parentOptions}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onArchive={handleArchive}
          onDuplicate={handleDuplicate}
          isSaving={isSaving}
          canPublish={canPublish}
          canArchive={canArchive}
        />
      </div>

      {/* Loading overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-6 py-4 shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="font-medium">Salvando página...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBuilder;