// hooks/useContentLoader.ts
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { GrapesJSEditor } from '../types/editor.types';

interface UseContentLoaderProps {
  editorRef: React.MutableRefObject<GrapesJSEditor | null>;
  isEditorReady: boolean;
  pageData: any;
  id?: string;
}

/**
 * Hook para carregar o conteúdo da página no editor
 */
export const useContentLoader = ({ 
  editorRef, 
  isEditorReady, 
  pageData, 
  id 
}: UseContentLoaderProps) => {
  const [contentLoaded, setContentLoaded] = useState(false);

  // Reset ao mudar de página
  useEffect(() => {
    setContentLoaded(false);
  }, [id]);

  // Carrega conteúdo
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !pageData?.data || contentLoaded) {
      return;
    }

    const page = pageData.data;
    console.log('📄 Carregando conteúdo:', page.name);

    if (!page.content) {
      setContentLoaded(true);
      console.log('📝 Página nova (sem conteúdo)');
      return;
    }

    const content = page.content as any;

    const timer = setTimeout(() => {
      const editor = editorRef.current;

      if (!editor) {
        console.error('❌ Editor não disponível');
        toast.error('Editor não está pronto. Tente recarregar.');
        return;
      }

      if (typeof editor.setComponents !== 'function') {
        console.error('❌ editor.setComponents não é uma função');
        return;
      }

      try {
        // Opção 1: Grapes components
        if (content.grapes?.components) {
          console.log('🔄 Carregando via GRAPES');
          editor.setComponents(content.grapes.components);

          if (content.grapes.styles && typeof editor.setStyle === 'function') {
            editor.setStyle(content.grapes.styles);
          }
        }
        // Opção 2: HTML
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

        setContentLoaded(true);
        console.log('✅ Conteúdo carregado!');
      } catch (error) {
        console.error('❌ Erro ao carregar conteúdo:', error);
        toast.error('Erro ao carregar conteúdo');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isEditorReady, pageData, contentLoaded, editorRef, id]);

  return { contentLoaded };
};