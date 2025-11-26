// src/components/admin/page-builder-grapesjs/utils/ui.utils.ts

/**
 * Utilitários para manipulação de UI
 */

import type { GrapesJSEditor } from '../types/editor.types';

/**
 * Remove botões duplicados/desnecessários do painel
 */
export const removeUnnecessaryButtons = (editor: GrapesJSEditor): void => {
  const panelManager = editor.Panels;

  const buttonsToRemove = [
    'export-template',
    'gjs-open-import-webpage',     
    'fullscreen',
     
  ];

  buttonsToRemove.forEach(buttonId => {
    try {
      panelManager.removeButton('options', buttonId);
    } catch {
      // Botão não existe, ignora
    }
  });
};

/**
 * Função auxiliar para escapar nomes de seletores CSS
 */
export const escapeName = (name: string): string => {
  return `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, '-');
};