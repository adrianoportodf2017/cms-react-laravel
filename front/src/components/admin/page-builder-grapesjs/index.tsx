import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'grapesjs/dist/css/grapes.min.css';
import { toast } from 'sonner';

import { useSalvarPagina, useAtualizarPagina, useObterPaginaPorId } from '../../../services/pages';
import { useGrapesEditor } from './hooks/useGrapesEditor';
import { EditorHeader } from './layout/Header';
import { EditorFields } from './fields/Fields';
import { EditorSidebar } from './layout/Sidebar';
import './styles/editor-custom.css'; // ✅ ADICIONE ESTA LINHA


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
  const [contentLoaded, setContentLoaded] = useState(false);

  // Hooks
  const salvarPagina = useSalvarPagina();
  const atualizarPagina = useAtualizarPagina();
  const { data: pageData, isLoading } = useObterPaginaPorId(id || '', !!id);

  // ✅ CARREGA DADOS DA PÁGINA
  useEffect(() => {
    // ✅ Verificações mais rigorosas
    if (!isEditorReady) {
      console.log('⏳ Editor não está pronto');
      return;
    }

    if (!editorRef.current) {
      console.log('⏳ editorRef.current ainda é null');
      return;
    }

    if (!pageData?.data) {
      console.log('⏳ Sem dados da página');
      return;
    }

    if (contentLoaded) {
      console.log('✓ Conteúdo já foi carregado');
      return;
    }

    const page = pageData.data;
    
    console.log('📄 Carregando página:', page.name);
    
    // Atualiza estados
    setPageTitle(page.name);
    setPageSlug(page.slug);
    setStatus(page.status);
    setInMainMenu(!!page.in_main_menu);
    setDisplayOrder(page.display_order || 0);
    setIsFeatured(!!page.is_featured);
    setParentId(page.parent_id || null);

    // ✅ Carrega conteúdo
    if (page.content) {
      const content = page.content as any;
      
      const timer = setTimeout(() => {
        // ✅ Captura a referência LOCAL
        const editor = editorRef.current;
        
        // ✅ Verificação CRÍTICA
        if (!editor) {
          console.error('❌ Editor ainda não disponível após timeout');
          toast.error('Editor não está pronto. Tente recarregar a página.');
          return;
        }

        // ✅ Verifica se os métodos existem
        if (typeof editor.setComponents !== 'function') {
          console.error('❌ editor.setComponents não é uma função');
          console.error('Editor atual:', editor);
          return;
        }

        try {
          // OPÇÃO 1: Grapes components
          if (content.grapes?.components) {
            console.log('🔄 Carregando via GRAPES');
            editor.setComponents(content.grapes.components);
            
            if (content.grapes.styles && typeof editor.setStyle === 'function') {
              editor.setStyle(content.grapes.styles);
            }
          }
          // OPÇÃO 2: HTML
          else if (content.html) {
            console.log('🔄 Carregando via HTML');
            
            const htmlSemStyle = content.html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            
            if (htmlSemStyle.trim()) {
              editor.setComponents(htmlSemStyle);
            }
            
            const styleMatch = content.html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            if (styleMatch?.[1] && typeof editor.setStyle === 'function') {
              editor.setStyle(styleMatch[1]);
            }
          }
          else {
            console.log('📝 Página nova (sem conteúdo)');
          }

          setContentLoaded(true);
          console.log('✅ Conteúdo carregado com sucesso!');
          
        } catch (error) {
          console.error('❌ Erro ao carregar conteúdo:', error);
          console.error('Tipo do erro:', error instanceof Error ? error.message : error);
          toast.error('Erro ao carregar conteúdo');
        }
      }, 800); // ✅ Aumentei para 800ms

      return () => clearTimeout(timer);
    } else {
      setContentLoaded(true);
      console.log('📝 Página nova');
    }
  }, [isEditorReady, pageData, contentLoaded]);

  // Reset ao mudar de página
  useEffect(() => {
    setContentLoaded(false);
  }, [id]);

  // Salvar
  const handleSave = async () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Preencha nome e slug!');
      return;
    }

    const editor = editorRef.current;

    if (!editor || !isEditorReady) {
      toast.error('Editor não está pronto');
      return;
    }

    // ✅ Verifica se os métodos existem
    if (typeof editor.getHtml !== 'function' || typeof editor.getCss !== 'function') {
      toast.error('Editor não está completamente inicializado');
      return;
    }

    try {
      const html = editor.getHtml();
      const css = editor.getCss();
      const projectData = editor.getProjectData();

      const components = projectData.pages?.[0]?.frames?.[0]?.component?.components || [];
      const styles = projectData.styles || [];

      console.log('💾 Salvando página...');

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Carregando editor...</p>
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