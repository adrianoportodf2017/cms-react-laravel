import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'grapesjs/dist/css/grapes.min.css';
import { toast } from 'sonner';

import { useSalvarPagina, useAtualizarPagina, useObterPaginaPorId } from '../../../services/pages';
import { useGrapesEditor } from './hooks/useGrapesEditor';
import { EditorHeader } from './layout/Header';
import { EditorFields } from './fields/Fields';
import { EditorSidebar } from './layout/Sidebar';

export const GrapesPageBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { editorRef, isEditorReady } = useGrapesEditor();

  // Estados
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [inMainMenu, setInMainMenu] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Hooks
  const salvarPagina = useSalvarPagina();
  const atualizarPagina = useAtualizarPagina();
  const { data: pageData, isLoading } = useObterPaginaPorId(id || '', !!id);

  // Carrega dados da página - CORRIGIDO PRA FUNCIONAR COM HTML OU GRAPES
  useEffect(() => {
    if (pageData?.data && editorRef.current && isEditorReady) {
      const page = pageData.data;
      
      // Atualiza estados
      setPageTitle(page.name);
      setPageSlug(page.slug);
      setStatus(page.status);
      setInMainMenu(!!page.in_main_menu);
      setDisplayOrder(page.display_order || 0);
      setIsFeatured(!!page.is_featured);
      setParentId(page.parent_id || null);

      // Carrega conteúdo no editor
      if (page.content) {
        try {
          const content = page.content as any;
          
          setTimeout(() => {
            if (!editorRef.current) return;

            // OPÇÃO 1: Se tem estrutura grapes salva (components + styles)
            if (content.grapes && content.grapes.components) {
              console.log('🔄 Carregando via GRAPES (components)');
              editorRef.current.setComponents(content.grapes.components);
              
              if (content.grapes.styles) {
                editorRef.current.setStyle(content.grapes.styles);
              }
            }
            // OPÇÃO 2: Se só tem HTML (carrega o HTML direto)
            else if (content.html) {
              console.log('🔄 Carregando via HTML');
              // Remove as tags <style> do HTML pra não duplicar
              const htmlSemStyle = content.html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
              editorRef.current.setComponents(htmlSemStyle);
              
              // Extrai e seta o CSS se tiver
              const styleMatch = content.html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
              if (styleMatch && styleMatch[1]) {
                editorRef.current.setStyle(styleMatch[1]);
              }
            }
            else {
              console.log('⚠️ Página vazia');
            }

          }, 100);
        } catch (error) {
          console.error('❌ Erro ao carregar dados:', error);
          toast.error('Erro ao carregar conteúdo da página');
        }
      }
    }
  }, [pageData, isEditorReady, editorRef]);

  // Salvar - SEMPRE SALVA HTML + GRAPES
  const handleSave = async () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Preencha nome e slug!');
      return;
    }

    if (!editorRef.current || !isEditorReady) {
      toast.error('Editor não está pronto');
      return;
    }

    try {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      const projectData = editorRef.current.getProjectData();

      const components = projectData.pages?.[0]?.frames?.[0]?.component?.components || [];
      const styles = projectData.styles || [];

      console.log('💾 Salvando:', { components, styles });

      const payload = {
        name: pageTitle,
        slug: pageSlug,
        status,
        content: {
          html: html + (css ? `<style>${css}</style>` : ''),
          css: css,
          grapes: { 
            components, 
            styles 
          },
        },
        is_featured: isFeatured,
        display_order: displayOrder,
        in_main_menu: inMainMenu,
        parent_id: parentId,
      };

      if (id) {
        await atualizarPagina.mutateAsync({ id, data: payload });
        toast.success('✅ Atualizado!');
      } else {
        const res = await salvarPagina.mutateAsync(payload);
        toast.success('✅ Criado!');
        navigate(`/admin/grapes-builder/${res.data.id}`);
      }
    } catch (err: any) {
      console.error('❌ Erro:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <EditorHeader
        pageTitle={pageTitle}
        status={status}
        isEditorReady={isEditorReady}
        onBack={() => navigate('/admin/pages')}
        onSave={handleSave}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <EditorFields
            pageTitle={pageTitle}
            pageSlug={pageSlug}
            onPageTitleChange={setPageTitle}
            onPageSlugChange={setPageSlug}
          />

          <div id="gjs" className="flex-1" style={{ minHeight: '500px', background: '#f8f9fa' }} />
        </div>

        <EditorSidebar
          show={showSidebar}
          inMainMenu={inMainMenu}
          isFeatured={isFeatured}
          displayOrder={displayOrder}
          status={status}
          onClose={() => setShowSidebar(false)}
          onInMainMenuChange={setInMainMenu}
          onIsFeaturedChange={setIsFeatured}
          onDisplayOrderChange={setDisplayOrder}
          onStatusChange={setStatus}
        />
      </div>
    </div>
  );
};