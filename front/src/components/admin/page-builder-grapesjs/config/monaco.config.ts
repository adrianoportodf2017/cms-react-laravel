// src/components/admin/page-builder-grapesjs/config/monaco.config.ts

/**
 * Configuração do Monaco Editor para edição de código
 */

import { toast } from 'sonner';
import type { GrapesJSEditor } from '../types/editor.types';

declare global {
  interface Window {
    require: any;
    monaco: any;
    monacoInstance: any;
  }
}

/**
 * Adiciona comando e botão do Monaco Editor
 */
export const setupMonacoEditor = (editor: GrapesJSEditor): void => {
  // Adiciona comando
  editor.Commands.add('open-code', {
    run: (editor: any) => {
      openMonacoModal(editor);
    },
  });

  // Adiciona botão na toolbar
  editor.Panels.addButton('options', {
    id: 'open-code',
    className: 'fa fa-code',
    command: 'open-code',
    attributes: { title: 'Editar Código (Monaco)' },
  });
};

/**
 * Abre modal com Monaco Editor
 */
const openMonacoModal = (editor: GrapesJSEditor): void => {
  const modal = editor.Modal;
  const html = editor.getHtml();
  const css = editor.getCss();
  const code = `${html}\n<style>\n${css}\n</style>`;

  modal.setTitle('✨ Editar Código (Monaco Editor)');
  modal.setContent(getModalHTML());
  modal.open();

  loadMonacoEditor(editor, code, modal);
};

/**
 * HTML do modal
 */
const getModalHTML = (): string => {
  return `
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
  `;
};

/**
 * Carrega e inicializa Monaco Editor
 */
const loadMonacoEditor = (editor: GrapesJSEditor, code: string, modal: any): void => {
  setTimeout(() => {
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
    } else {
      loadMonacoScript(initEditor);
    }

    setupModalButtons(editor, modal);
  }, 100);
};

/**
 * Carrega script do Monaco Editor
 */
const loadMonacoScript = (callback: () => void): void => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
  script.onload = () => {
    window.require.config({
      paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
    });
    window.require(['vs/editor/editor.main'], callback);
  };
  document.body.appendChild(script);
};

/**
 * Configura botões do modal (Salvar e Cancelar)
 */
const setupModalButtons = (editor: GrapesJSEditor, modal: any): void => {
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
};