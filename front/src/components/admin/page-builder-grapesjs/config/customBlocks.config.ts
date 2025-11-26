// src/components/admin/page-builder-grapesjs/config/customBlocks.config.ts

/**
 * Blocos customizados do Cooperforte
 */

import type { GrapesJSEditor } from '../types/editor.types';
import { openMediaManager } from './mediaManager.config';

/**
 * Registra todos os blocos customizados
 */
export const registerCustomBlocks = (editor: GrapesJSEditor): void => {
  const blockManager = editor.BlockManager;

  // Remove bloco nativo de imagem
  blockManager.remove('upload');

  // Adiciona nosso bloco de imagem customizado
  blockManager.add('cooperforte-image', {
    label: 'Imagem',
    category: 'Básico',
    media: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    `,
    content: {
      type: 'image',
      activeOnRender: true,
      src: 'https://via.placeholder.com/350x250/cccccc/666666?text=Clique+para+escolher',
      style: {
        width: '100%',
        'max-width': '100%',
        height: 'auto',
      },
    },
    activate: true, // Abre a galeria automaticamente ao adicionar
  });

  // Hook: quando adiciona bloco de imagem, abre galeria
  editor.on('block:drag:stop', (component: any) => {
    if (component && component.get('type') === 'image') {
      // Aguarda um tick para garantir que o componente foi renderizado
      setTimeout(() => {
        openMediaManager(editor, component);
      }, 100);
    }
  });
};