// src/components/admin/page-builder-grapesjs/config/mediaManager.config.ts

/**
 * Integração do Media Manager customizado com GrapesJS
 */

import { createRoot } from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { GrapesJSEditor } from '../types/editor.types';
import { MediaManager } from '../blocks/ImageUploadBlock';

// Cria um QueryClient para o MediaManager
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function setupImageDoubleClick(editor: GrapesJSEditor) {
  editor.on('component:selected', (component) => {
    if (component.get('type') === 'image') {
      const view = component.getView();
      if (view) {
        // Remove event listeners antigos
        view.el.off = view.el.off || function() {};
        view.el.off('dblclick');
        
        // Adiciona novo listener para duplo clique
        view.el.on('dblclick', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('🖼️ Duplo clique na imagem - Abrindo Media Manager customizado');
          
          // Abre o media manager customizado
          editor.runCommand('open-media-manager', {
            target: component,
            onSelect: (imageUrl: string) => {
              // Atualiza a imagem com a URL selecionada
              component.addAttributes({ src: imageUrl });
              editor.select(component);
            }
          });
        });
      }
    }
  });
}


/**
 * Abre o Media Manager customizado
 */
export const openMediaManager = (
  editor: GrapesJSEditor, 
  component?: any
): void => {
  // Cria container do modal
  const modalContainer = document.createElement('div');
  modalContainer.id = 'media-manager-modal';
  document.body.appendChild(modalContainer);

  // Cria root do React
  const root = createRoot(modalContainer);

  // Callback quando seleciona imagem
  const handleSelect = (url: string) => {
    if (component) {
      // Se tem componente (clicou em imagem), atualiza
      component.set({
        src: url,
        attributes: {
          ...component.getAttributes(),
          src: url,
        }
      });
      component.view.render();
      console.log('✅ Imagem atualizada:', url);
    } else {
      // Se não tem componente (inserção nova), adiciona ao AssetManager
      editor.AssetManager.add([{
        src: url,
        name: url.split('/').pop() || 'image',
        type: 'image',
      }]);
      console.log('✅ Imagem adicionada ao Asset Manager:', url);
    }

    // Fecha o modal
    handleClose();
  };

  // Callback quando fecha modal
  const handleClose = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  // Renderiza o componente envolvido com QueryClientProvider
  root.render(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MediaManager, {
        onSelect: handleSelect,
        onClose: handleClose
      })
    )
  );
};

/**
 * Registra comando no GrapesJS para abrir Media Manager
 */
export const setupMediaManagerCommand = (editor: GrapesJSEditor): void => {
  editor.Commands.add('open-media-manager', {
    run: () => {
      openMediaManager(editor);
    }
  });

  // Adiciona botão na toolbar (opcional)
  editor.Panels.addButton('options', {
    id: 'open-media-manager',
    className: 'fa fa-image',
    command: 'open-media-manager',
    attributes: { title: 'Galeria de Mídias' },
  });
};

/**
 * Configura para que clique em imagem abra o Media Manager
 */
export const setupImageComponentIntegration = (editor: GrapesJSEditor): void => {
    setupImageDoubleClick(editor);

  editor.on('component:selected', (component: any) => {
    if (component.get('type') === 'image') {
      // Adiciona botão "Escolher Imagem" no toolbar da imagem
      const toolbar = component.get('toolbar');
      const hasMediaButton = toolbar.some((btn: any) => btn.id === 'select-media');

      if (!hasMediaButton) {
        component.set('toolbar', [
          ...toolbar,
          {
            id: 'select-media',
            label: '🖼️',
            command: () => openMediaManager(editor, component),
            attributes: { title: 'Escolher Imagem' },
          },
        ]);
      }
    }
  });
};