// src/components/admin/page-builder-grapesjs/config/styles.config.ts

import type { Editor } from 'grapesjs';

export type GrapesPlugin = (editor: Editor, options?: Record<string, unknown>) => void;

/**
 * Plugin customizado que converte classes CSS para IDs únicos
 */
export const createCustomCssPlugin = (): GrapesPlugin => {
  return (editor: Editor) => {
    const cssComposer = editor.Css;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalToHtml = (cssComposer as any).getAll;

    if (!originalToHtml) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cssComposer as any).getAll = function () {
      const rules = originalToHtml.call(this);
      
      if (!rules) return rules;

      rules.forEach((rule: any) => {
        if (rule.selectors && rule.selectors.length > 0) {
          const selector = rule.selectors[0];
          
          if (selector.type === 1 || !selector.type) {
            const className = selector.name;
            const wrapper = editor.getWrapper();
            const components = wrapper ? wrapper.find(`.${className}`) : [];

            if (components && components.length > 0) {
              const component = components[0];
              let componentId = component.getId();

              if (!componentId) {
                componentId = `gjs-auto-${Math.random().toString(36).substr(2, 9)}`;
                component.setId(componentId);
              }

              rule.selectors = [{
                name: componentId,
                type: 2,
                active: true,
                private: false
              }];
            }
          }
        }
      });
      
      return rules;
    };
  };
};

/**
 * Configura Tailwind CSS no iframe do editor
 */
export const setupTailwindInIframe = (editor: Editor): void => {
  const canvas = editor.Canvas;
  const frameEl = canvas.getFrameEl();
  
  if (!frameEl) {
    console.warn('Frame element não encontrado');
    return;
  }

  const iframeWindow = frameEl.contentWindow;
  const iframeDoc = iframeWindow?.document || frameEl.contentDocument;
  
  if (!iframeDoc) {
    console.warn('Iframe document não encontrado');
    return;
  }

  if (iframeDoc.querySelector('script[src*="tailwindcss"]')) {
    console.log('Tailwind já está carregado no iframe');
    return;
  }

  const tailwindScript = iframeDoc.createElement('script');
  tailwindScript.src = 'https://cdn.tailwindcss.com';
  iframeDoc.head.appendChild(tailwindScript);

  tailwindScript.onload = () => {
    const configScript = iframeDoc.createElement('script');
    configScript.textContent = `
      if (window.tailwind) {
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                cooperforte: { primary: '#1e40af', secondary: '#7e22ce' }
              }
            }
          }
        }
      }
    `;
    iframeDoc.head.appendChild(configScript);
    console.log('✅ Tailwind configurado no iframe');
  };
};

/**
 * Configura seleção de componentes para usar IDs
 */
export const setupComponentSelection = (editor: Editor): void => {
  editor.on('component:selected', (component: any) => {
    setTimeout(() => {
      if (!component || typeof component.getId !== 'function') return;

      let componentId = component.getId();

      if (!componentId) {
        componentId = `gjs-auto-${Math.random().toString(36).substr(2, 9)}`;
        component.setId(componentId);
      }

      const selectorManager = editor.Selectors;
      const existingSelector = selectorManager.get(`#${componentId}`);
      
      if (!existingSelector) {
        selectorManager.add({
          name: componentId,
          label: `#${componentId}`,
          type: 2,
          
        });
      }

      console.log(`🎯 Componente selecionado: #${componentId}`);
    }, 10);
  });
};

/**
 * Patch do getProjectData para converter classes em IDs ao salvar
 */
export const patchProjectData = (editor: Editor): void => {
  const originalGetProjectData = editor.getProjectData.bind(editor);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (editor as any).getProjectData = function () {
    const data = originalGetProjectData();
    
    if (data.styles) {
      data.styles = data.styles.map((style: any) => {
        if (style.selectors && style.selectors.length > 0) {
          const hasClassSelector = style.selectors.some((s: any) => 
            s.type === 1 || !s.type
          );

          if (hasClassSelector) {
            const className = style.selectors[0].name;
            const wrapper = editor.getWrapper();
            
            if (!wrapper) return style;
            
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
                  type: 2,
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
};