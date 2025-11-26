// src/components/admin/page-builder-grapesjs/hooks/useGrapesEditor.ts

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import type { GrapesJSEditor } from '../types/editor.types';

// Services
import { useUploadMedia, useListarMedia, useDeletarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

// Configs
import { setupDeviceButtons, hideNativeDeviceSelector } from '../config/devices.config';
import { setupMonacoEditor } from '../config/monaco.config';
import {
  createCustomCssPlugin,
  setupTailwindInIframe,
  setupComponentSelection,
  patchProjectData
} from '../config/styles.config';
import { removeUnnecessaryButtons, escapeName } from '../utils/ui.utils';
import {
  setupMediaManagerCommand,
  setupImageComponentIntegration
} from '../config/mediaManager.config';

export const useGrapesEditor = () => {
  const editorRef = useRef<GrapesJSEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Mutations
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeletarMedia();
  const { refetch: refetchMedia } = useListarMedia({
    type: 'image',
    status: 'active',
    per_page: 100,
  });

  useEffect(() => {
    let isMounted = true;
    let editor: GrapesJSEditor | null = null;

    const initializeEditor = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const container = document.getElementById('gjs');
        if (!container) {
          setTimeout(initializeEditor, 200);
          return;
        }

        const grapesjsModule = await import('grapesjs');
        const grapesjs = grapesjsModule.default || grapesjsModule;

        const tailwindPluginModule = await import('grapesjs-tailwind');
        const tailwindPlugin = tailwindPluginModule.default || tailwindPluginModule;

        // Importa plugin de blocos básicos
        const blocksBasicModule = await import('grapesjs-blocks-basic');
        const blocksBasic = blocksBasicModule.default || blocksBasicModule;

        if (!isMounted) return;

        const customCssPlugin = createCustomCssPlugin();

        editor = grapesjs.init({
          container: '#gjs',
          height: '100vh',
          fromElement: true,
          storageManager: false,

          selectorManager: {
            escapeName,
            componentFirst: true,
          },

          forceClass: false,
          avoidInlineStyle: true,

          assetManager: {
            upload: 'auto',
            assets: [],
            
            uploadFile: async function (e: any) {
              if (e.preventDefault) e.preventDefault();

              const files = e.dataTransfer ? e.dataTransfer.files : e.target?.files;
              if (!files || files.length === 0) return;

              const currentEditor = editor;
              if (!currentEditor) return;

              const uploadedAssets: any[] = [];

              for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!validarTipoArquivo(file) || !validarTamanhoArquivo(file)) {
                  toast.error(`Arquivo inválido: ${file.name}`);
                  continue;
                }

                try {
                  toast.loading(`Enviando ${file.name}...`, { id: 'upload-toast' });

                  const response = await uploadMutation.mutateAsync({ file });
                  const media = response.data;

                  uploadedAssets.push({
                    src: media.url,
                    type: 'image',
                    name: media.title || media.filename,
                    height: media.height,
                    width: media.width,
                    id: String(media.id)
                  });

                  toast.dismiss('upload-toast');
                  toast.success('Upload concluído!');

                } catch (err) {
                  console.error(err);
                  toast.dismiss('upload-toast');
                  toast.error(`Erro ao enviar ${file.name}`);
                }
              }

              if (uploadedAssets.length > 0) {
                currentEditor.AssetManager.add(uploadedAssets);
                await refetchMedia();
              }
            }
          },

          plugins: [
            blocksBasic,
            tailwindPlugin, 
            customCssPlugin
          ],

          pluginsOpts: {
            [blocksBasic]: {
              flexGrid: true,
              blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
              category: 'Básico',
            },
            'grapesjs-tailwind': {
              tailwindPlayCdn: 'https://cdn.tailwindcss.com',
              tailwindConfig: {
                theme: {
                  extend: {
                    colors: {
                      cooperforte: { primary: '#1e40af', secondary: '#7e22ce' }
                    }
                  }
                }
              },
              loadBlocks: true,
              changeThemeText: 'Alterar Tema',
              category: 'Tailwind',
            }
          },

          deviceManager: {
            devices: [
              { id: 'desktop', name: 'Desktop', width: '' },
              { id: 'tablet', name: 'Tablet', width: '768px' },
              { id: 'mobile', name: 'Mobile', width: '375px' },
            ],
          },

          canvas: {
            styles: ['https://cdn.tailwindcss.com'],
          },
        });

        editor.on('load', async () => {
          console.log('✅ Editor carregado');

          if (!editor) return;

          removeUnnecessaryButtons(editor);
          hideNativeDeviceSelector();
          setupDeviceButtons(editor);
          setupComponentSelection(editor);
          patchProjectData(editor);
          setupTailwindInIframe(editor);
          setupMonacoEditor(editor);
          setupMediaManagerCommand(editor);
          setupImageComponentIntegration(editor);

          // Reordena categorias de blocos
          const blockManager = editor.BlockManager;
          const categories = blockManager.getCategories();
          
          categories.each((category: any) => {
            const categoryId = category.get('id');
            if (categoryId === 'Básico') {
              category.set('order', 0);
            } else if (categoryId === 'Tailwind') {
              category.set('order', 1);
            }
          });

          editor.on('asset:open', async () => {
            try {
              const res = await refetchMedia();
              const serverMedia = res.data?.data.data || [];

              const assets = serverMedia
                .filter((m: any) => m.type === 'image')
                .map((m: any) => ({
                  src: m.url,
                  type: 'image',
                  name: m.title || m.filename,
                  height: m.height,
                  width: m.width,
                  id: String(m.id)
                }));

              editor?.AssetManager.getAll().reset();
              editor?.AssetManager.add(assets);
            } catch (e) {
              console.error('Erro ao carregar assets', e);
            }
          });

          editor.on('asset:remove', async (asset: any) => {
            const id = asset.get('id');
            if (id) {
              try {
                await deleteMutation.mutateAsync(Number(id));
                toast.success('Mídia removida');
              } catch (e) {
                console.error(e);
              }
            }
          });

          console.log('🖼️ Media Manager configurado');
        });

        if (isMounted) {
          editorRef.current = editor;
          setIsEditorReady(true);
          console.log('🎉 Editor pronto');
        }
      } catch (error) {
        console.error('❌ Erro:', error);
        toast.error('Erro ao carregar editor');
      }
    };

    if (!editorRef.current && isMounted) {
      initializeEditor();
    }

    return () => {
      isMounted = false;
      if (editor) {
        try {
          editor.destroy();
        } catch (e) {
          console.warn('Erro ao destruir editor:', e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { editorRef, isEditorReady };
};