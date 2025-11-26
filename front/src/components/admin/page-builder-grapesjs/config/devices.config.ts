// src/components/admin/page-builder-grapesjs/config/devices.config.ts

/**
 * Configuração e comandos dos dispositivos (Desktop, Tablet, Mobile)
 */

import type { GrapesJSEditor } from '../types/editor.types';

/**
 * Configura os comandos de dispositivos e adiciona botões na toolbar
 */
export const setupDeviceButtons = (editor: GrapesJSEditor): void => {
  const panelManager = editor.Panels;
  const optionsPanel = panelManager.getPanel('options');

  // Comandos dos devices
  editor.Commands.add('set-device-desktop', {
    run: (ed: any) => {
      ed.setDevice('Desktop');
      updateActiveDeviceButton('desktop');
    }
  });

  editor.Commands.add('set-device-tablet', {
    run: (ed: any) => {
      ed.setDevice('Tablet');
      updateActiveDeviceButton('tablet');
    }
  });

  editor.Commands.add('set-device-mobile', {
    run: (ed: any) => {
      ed.setDevice('Mobile');
      updateActiveDeviceButton('mobile');
    }
  });

  // Adiciona botões no painel
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
};

/**
 * Atualiza visualmente qual botão de device está ativo
 */
const updateActiveDeviceButton = (activeDevice: string): void => {
  document.querySelectorAll('[data-device-btn]').forEach(btn => {
    btn.classList.remove('gjs-pn-active');
  });
  document.querySelector(`[data-device-btn="${activeDevice}"]`)?.classList.add('gjs-pn-active');
};

/**
 * Remove o seletor nativo de devices do GrapesJS
 */
export const hideNativeDeviceSelector = (): void => {
  setTimeout(() => {
    const devicesContainer = document.querySelector('.gjs-devices-c');
    if (devicesContainer) {
      (devicesContainer as HTMLElement).style.display = 'none';
    }
  }, 100);
};