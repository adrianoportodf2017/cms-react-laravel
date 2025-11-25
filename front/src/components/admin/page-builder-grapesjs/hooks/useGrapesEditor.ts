import { useEffect, useState, useRef } from 'react';

import { toast } from 'sonner';
import { registerImageUploadBlock } from '../blocks/ImageUploadBlock';


declare global {
  interface Window {
    require: any;
    monaco: any;
    monacoInstance: any;
  }
}

export const useGrapesEditor = () => {
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let editor: any = null;

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

        if (!isMounted) return;

        const customCssPlugin = (editor: any) => {
          const originalToHtml = editor.CssComposer.getAllToHtml;

          editor.CssComposer.getAllToHtml = function() {
            const originalCss = originalToHtml.call(this);

            return originalCss.replace(/\.([a-zA-Z0-9_-]+)\s*\{/g, (match: string, className: string) => {
              const components = editor.getWrapper().find(`.${className}`);
              if (components && components.length > 0) {
                const component = components[0];
                let componentId = component.getId();
                if (!componentId) {
                  componentId = `gjs-auto-${Math.random().toString(36).substr(2, 9)}`;
                  component.setId(componentId);
                }
                return `#${componentId} {`;
              }
              return match;
            });
          };
        };

        const escapeName = (name: string) => `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, '-');

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
          plugins: [tailwindPlugin, customCssPlugin],
          pluginsOpts: {
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
              changeThemeText: 'Alterar Tema'
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

        editor.on('load', () => {
          console.log('✅ Editor carregado');
        registerImageUploadBlock(editor);

          // REMOVE BOTÕES DUPLICADOS
          const panelManager = editor.Panels;
          
          // Remove botões nativos duplicados
          panelManager.removeButton('options', 'export-template');
          panelManager.removeButton('options', 'gjs-open-import-webpage');
          panelManager.removeButton('options', 'preview');
          panelManager.removeButton('options', 'fullscreen');
          
          // ESCONDE O SELECT NATIVO DE DEVICES
          setTimeout(() => {
            const devicesContainer = document.querySelector('.gjs-devices-c');
            if (devicesContainer) {
              (devicesContainer as HTMLElement).style.display = 'none';
            }
          }, 100);
          
          // ADICIONA BOTÕES CUSTOMIZADOS COM ÍCONES
          const optionsPanel = panelManager.getPanel('options');
          
          // Comandos dos devices
          editor.Commands.add('set-device-desktop', { 
            run: (ed: any) => {
              ed.setDevice('Desktop');
              // Atualiza visual dos botões
              document.querySelectorAll('[data-device-btn]').forEach(btn => {
                btn.classList.remove('gjs-pn-active');
              });
              document.querySelector('[data-device-btn="desktop"]')?.classList.add('gjs-pn-active');
            }
          });
          
          editor.Commands.add('set-device-tablet', { 
            run: (ed: any) => {
              ed.setDevice('Tablet');
              document.querySelectorAll('[data-device-btn]').forEach(btn => {
                btn.classList.remove('gjs-pn-active');
              });
              document.querySelector('[data-device-btn="tablet"]')?.classList.add('gjs-pn-active');
            }
          });
          
          editor.Commands.add('set-device-mobile', { 
            run: (ed: any) => {
              ed.setDevice('Mobile');
              document.querySelectorAll('[data-device-btn]').forEach(btn => {
                btn.classList.remove('gjs-pn-active');
              });
              document.querySelector('[data-device-btn="mobile"]')?.classList.add('gjs-pn-active');
            }
          });

          // Adiciona botões no painel options
          optionsPanel.get('buttons').add([
            {
              id: 'set-device-desktop',
              command: 'set-device-desktop',
              className: 'fa fa-desktop',
              active: true,
              attributes: { 
                title: 'Desktop',
                'data-device-btn': 'desktop'
              },
            },
            {
              id: 'set-device-tablet',
              command: 'set-device-tablet',
              className: 'fa fa-tablet',
              attributes: { 
                title: 'Tablet',
                'data-device-btn': 'tablet'
              },
            },
            {
              id: 'set-device-mobile',
              command: 'set-device-mobile',
              className: 'fa fa-mobile',
              attributes: { 
                title: 'Mobile',
                'data-device-btn': 'mobile'
              },
            },
          ]);
          
          // *** FORÇA O SELECTOR MANAGER A USAR O ID ***
          editor.on('component:selected', (component: any) => {
            setTimeout(() => {
              if (!component || !component.getId) return;

              let componentId = component.getId();
              
              if (!componentId) {
                componentId = `gjs-auto-${Math.random().toString(36).substr(2, 9)}`;
                component.setId(componentId);
              }
  
              const selectorManager = editor.SelectorManager;
              
              const idSelector = selectorManager.add({
                name: componentId,
                label: `#${componentId}`,
                type: 2,
                private: false
              });
  
              selectorManager.setSelected([idSelector]);
              
              console.log(`🎯 Focado no ID: #${componentId}`);
            }, 10);
          });

          // PATCH DO PROJECT DATA
          const originalGetProjectData = editor.getProjectData.bind(editor);
          
          editor.getProjectData = function() {
            const data = originalGetProjectData();
            if (data.styles) {
              data.styles = data.styles.map((style: any) => {
                if (style.selectors && style.selectors.length > 0) {
                  const hasClassSelector = style.selectors.some((s: any) => s.type === 'class' || !s.type); 
                  
                  if (hasClassSelector) {
                    const className = style.selectors[0].name;
                    const wrapper = editor.getWrapper();
                    const components = wrapper.find(`.${className}`);
                    
                    if (components && components.length > 0) {
                      const component = components[0];
                      let componentId = component.getId();
                      
                      if (!componentId) {
                        componentId = `gjs-save-${Math.random().toString(36).substr(2, 9)}`;
                        component.setId(componentId);
                      }

                      return {
                        ...style,
                        selectors: [{ 
                          name: componentId, 
                          type: 'id',
                          active: true,
                          private: false
                        }]
                      };
                    }
                  }
                }
                return style;
              });
              console.log('💾 ProjectData: Classes → IDs');
            }
            return data;
          };

          // Tailwind no iframe
          const iframe = editor.Canvas.getFrameEl();
          if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const tailwindScript = iframeDoc.createElement('script');
              tailwindScript.src = 'https://cdn.tailwindcss.com';
              iframeDoc.head.appendChild(tailwindScript);

              const configScript = iframeDoc.createElement('script');
              configScript.textContent = `
                tailwind.config = {
                  theme: {
                    extend: {
                      colors: {
                        cooperforte: { primary: '#1e40af', secondary: '#7e22ce' }
                      }
                    }
                  }
                }
              `;
              iframeDoc.head.appendChild(configScript);
            }
          }
        });

        // *** MONACO EDITOR (ÚNICO) ***
        editor.Commands.add('open-code', {
          run: (editor: any) => {
            const modal = editor.Modal;
            const html = editor.getHtml();
            const css = editor.getCss(); 
            const code = `${html}\n<style>\n${css}\n</style>`;

            modal.setTitle('✨ Editar Código (Monaco Editor)');
            modal.setContent(`
              <div style="display: flex; flex-direction: column; height: 80vh;">
                <div style="padding: 10px; background: #1e1e1e; border-bottom: 1px solid #333;">
                  <p style="margin: 0; font-size: 14px; color: #d4d4d4;">
                    💡 CSS com IDs únicos | Tailwind suportado | Ctrl+F para buscar
                  </p>
                </div>
                <div style="flex: 1; overflow: hidden; position: relative;">
                  <div id="monaco-container" style="width: 100%; height: 100%;">Carregando Monaco Editor...</div>
                </div>
                <div style="padding: 10px; border-top: 1px solid #333; display: flex; gap: 10px; justify-content: flex-end; background: #1e1e1e;">
                  <button id="cancel-code" style="padding: 8px 16px; background: #4b5563; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Cancelar
                  </button>
                  <button id="save-code" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    💾 Salvar e Aplicar
                  </button>
                </div>
              </div>
            `);
            modal.open();

            const loadMonaco = () => {
              const initEditor = () => {
                if (window.monaco) {
                  if (window.monacoInstance) {
                    window.monacoInstance.dispose();
                  }

                  const container = document.getElementById('monaco-container');
                  if (container) {
                    container.innerHTML = '';
                    window.monacoInstance = window.monaco.editor.create(container, {
                      value: code,
                      language: 'html',
                      theme: 'vs-dark',
                      automaticLayout: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      formatOnPaste: true,
                      formatOnType: true,
                    });
                  }
                }
              };

              if (window.monaco) {
                initEditor();
                return;
              }

              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
              script.onload = () => {
                window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
                window.require(['vs/editor/editor.main'], () => {
                  initEditor();
                });
              };
              document.body.appendChild(script);
            };

            setTimeout(() => {
              loadMonaco();

              const saveBtn = document.getElementById('save-code');
              const cancelBtn = document.getElementById('cancel-code');

              if (saveBtn) {
                saveBtn.onclick = () => {
                  const newCode = window.monacoInstance ? window.monacoInstance.getValue() : '';
                  
                  const styleMatch = newCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
                  const htmlSemStyle = newCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

                  editor.setComponents(htmlSemStyle.trim());
                  if (styleMatch && styleMatch[1]) {
                    editor.setStyle(styleMatch[1].trim());
                  }
                  modal.close();
                  toast.success('✅ Código atualizado!');
                };
              }
              if (cancelBtn) {
                cancelBtn.onclick = () => {
                  modal.close();
                };
              }
            }, 100);
          },
        });

        // ADICIONA SÓ O BOTÃO DO MONACO
        editor.Panels.addButton('options', {
          id: 'open-code',
          className: 'fa fa-code',
          command: 'open-code',
          attributes: { title: 'Editar Código (Monaco)' },
        });

        if (isMounted) {
          editorRef.current = editor;
          setIsEditorReady(true);
          console.log('🎉 Editor pronto com UI limpa!');
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
        try { editor.destroy(); } catch (e) {}
      }
    };
  }, []);

  return { editorRef, isEditorReady };
};