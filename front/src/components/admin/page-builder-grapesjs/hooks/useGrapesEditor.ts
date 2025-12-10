// src/components/admin/page-builder-grapesjs/hooks/useGrapesEditor.ts

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import type { GrapesJSEditor } from '../types/editor.types';

// Services
import { useUploadMedia, useListarMedia, useDeletarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

// Configs
import { setupDeviceButtons, hideNativeDeviceSelector } from '../config/devices.config';
import { registerFormBlocks } from '../config/formBlocks.config';

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

  const setupLeftPanels = (editor: GrapesJSEditor) => {
  // Remove painéis padrão
  const panels = editor.Panels;
  const modal = editor.Modal;
  
  // Esconde painéis padrão
  panels.getPanels().each((panel: any) => {
    if (panel.get('id') !== 'views-container') {
      panel.set('visible', false);
    }
  });

  // Cria painel esquerdo customizado
  const leftPanel = panels.addPanel({
    id: 'left-panel',
    el: '#left-panel-container', // Você precisa criar este elemento no HTML
    buttons: [
      {
        id: 'blocks-toggle',
        active: true,
        label: 'Blocos',
        command: 'open-blocks',
        togglable: false
      },
      {
        id: 'layers-toggle',
        active: false,
        label: 'Camadas',
        command: 'open-layers',
        togglable: false
      }
    ]
  });
};

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
            [blocksBasic ]: {
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

  registerFormBlocks(editor);
  removeUnnecessaryButtons(editor);
  hideNativeDeviceSelector();
  setupDeviceButtons(editor);
  setupComponentSelection(editor);
  patchProjectData(editor);
  setupTailwindInIframe(editor);
  setupMonacoEditor(editor);
  setupMediaManagerCommand(editor);
  setupImageComponentIntegration(editor);

  // ✨ FIX: Intercepta mudanças do Style Manager em tempo real
  editor.on('component:styleUpdate', (component: any) => {
    if (!editor) return;
    
    const device = editor.getDevice();
    if (!device || device === 'desktop') return;

    const view = component.getEl();
    const styles = component.getStyle();
    
    if (view && styles) {
      Object.keys(styles).forEach(prop => {
        (view.style as any)[prop] = styles[prop];
      });
    }
  });

  // ✨ FIX: Escuta mudanças em qualquer propriedade de estilo
  editor.on('component:update:style', (component: any) => {
    if (!editor) return;
    
    const device = editor.getDevice();
    if (!device || device === 'desktop') return;

    const view = component.getEl();
    const styles = component.getStyle();
    
    if (view && styles) {
      Object.keys(styles).forEach(prop => {
        (view.style as any)[prop] = styles[prop];
      });
    }
  });

  // ✨ FIX: Ao trocar device, reaplica os estilos
  editor.on('change:device', () => {
    if (!editor) return;
    
    const device = editor.getDevice();
    const selected = editor.getSelected();
    
    console.log('📱 Device mudou para:', device);
    
    if (selected) {
      const styles = selected.getStyle();
      const view = selected.getEl();
      
      if (view && styles) {
        Object.keys(styles).forEach(prop => {
          (view.style as any)[prop] = styles[prop];
        });
      }
    }
    
    editor.refresh();
  });

  // ✨ RESIZE COM EMPURRAR - TODOS os elementos incluindo TEXT
  editor.DomComponents.getWrapper().onAll((component: any) => {
    if (component.get('type') === 'wrapper') return;

    const componentType = component.get('type');
    const isText = componentType === 'text' || componentType === 'textnode';

    component.set({
      resizable: {
        tl: 1, tc: 1, tr: 1,
        cl: 1, cr: 1,
        bl: 1, bc: 1, br: 1,
        keyWidth: 'width',
        keyHeight: 'height',
        
        updateTarget: (el: any, rect: any) => {
          el.style.width = rect.w + 'px';
          el.style.height = rect.h + 'px';
          
          // ✨ FIX: Força display block para elementos text
          if (isText || el.tagName === 'SPAN' || el.tagName === 'A') {
            el.style.display = 'block';
          }
          
          const parent = el.parentElement;
          if (parent) {
            const parentDisplay = window.getComputedStyle(parent).display;
            if (parentDisplay.includes('flex') || parentDisplay.includes('grid')) {
              parent.style.display = 'none';
              parent.offsetHeight;
              parent.style.display = parentDisplay;
            }
          }
        },
        
        onEnd: (e: any, opts: any) => {
          const comp = opts.target;
          if (comp) {
            const styles: Record<string, string> = { // Fix TypeScript error
              width: opts.w + 'px',
              height: opts.h + 'px'
            };
            
            // Garante display block para text
            if (isText) {
              styles.display = 'block';
            }
            
            comp.addStyle(styles);
          }
        }
      },
      
      // ✨ Força display block para TODOS incluindo text
      style: {
        position: 'relative',
        display: 'block'
      }
    });
  });

  editor.on('component:add', (component: any) => {
    if (component.get('type') === 'wrapper') return;

    const componentType = component.get('type');
    const isText = componentType === 'text' || componentType === 'textnode';

    component.set({
      resizable: {
        tl: 1, tc: 1, tr: 1,
        cl: 1, cr: 1,
        bl: 1, bc: 1, br: 1,
        keyWidth: 'width',
        keyHeight: 'height',
        
        updateTarget: (el: any, rect: any) => {
          el.style.width = rect.w + 'px';
          el.style.height = rect.h + 'px';
          
          // Força display block para elementos text
          if (isText || el.tagName === 'SPAN' || el.tagName === 'A') {
            el.style.display = 'block';
          }
          
          const parent = el.parentElement;
          if (parent) {
            const parentDisplay = window.getComputedStyle(parent).display;
            if (parentDisplay.includes('flex') || parentDisplay.includes('grid')) {
              parent.style.display = 'none';
              parent.offsetHeight;
              parent.style.display = parentDisplay;
            }
          }
        },
        
        onEnd: (e: any, opts: any) => {
          const comp = opts.target;
          if (comp) {
            const styles: Record<string, string> = {
              width: opts.w + 'px',
              height: opts.h + 'px'
            };
            
            if (isText) {
              styles.display = 'block';
            }
            
            comp.addStyle(styles);
          }
        }
      },
      
      style: {
        position: 'relative',
        display: 'block'
      }
    });
  });

  console.log('✅ Resize habilitado em todos os componentes');

  // Reordena categorias
  const blockManager = editor.BlockManager;
  const categories = blockManager.getCategories();
  
  if (categories) {
    categories.each((category: any) => {
      const categoryId = category.get('id');
      if (categoryId === 'Básico') {
        category.set('order', 0);
      } else if (categoryId === 'Tailwind') {
        category.set('order', 1);
      }
    });
  }

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