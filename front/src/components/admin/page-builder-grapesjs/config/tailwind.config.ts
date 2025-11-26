// src/components/admin/page-builder-grapesjs/config/tailwind.config.ts

import type { GrapesEditor } from '../types/grapesjs.types';

export const setupTailwindInIframe = (editor: GrapesEditor): void => {
  // Aguarda o iframe estar pronto
  setTimeout(() => {
    const iframe = editor.Canvas.getFrameEl();
    
    if (!iframe) {
      console.warn('⚠️ Iframe não encontrado');
      return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) {
      console.warn('⚠️ Documento do iframe não acessível');
      return;
    }

    try {
      // Adiciona Tailwind CSS CDN
      const tailwindScript = iframeDoc.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      tailwindScript.onload = () => {
        console.log('✅ Tailwind CSS carregado no iframe');
        
        // Configura Tailwind após carregamento
        const configScript = iframeDoc.createElement('script');
        configScript.textContent = `
          if (typeof tailwind !== 'undefined') {
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    cooperforte: { 
                      primary: '#1e40af', 
                      secondary: '#7e22ce' 
                    }
                  }
                }
              }
            };
          }
        `;
        iframeDoc.head.appendChild(configScript);
      };
      
      tailwindScript.onerror = () => {
        console.error('❌ Erro ao carregar Tailwind CSS');
      };
      
      iframeDoc.head.appendChild(tailwindScript);
    } catch (error) {
      console.error('❌ Erro ao configurar Tailwind:', error);
    }
  }, 500); // Delay para garantir que iframe está pronto
};