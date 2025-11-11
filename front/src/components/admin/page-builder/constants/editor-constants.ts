// 🔥 ESTILOS CSS PARA O MODO OUTLINE (ESTILO ELEMENTOR) COM ÍCONES DE MOVER
export const outlineStyles = `
  .outline-mode div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"]) {
    border: 2px dashed #3b82f6 !important;
    margin: 4px !important;
    padding: 8px !important;
    position: relative !important;
    border-radius: 6px !important;
    transition: all 0.2s ease !important;
  }
  
  .outline-mode div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"])::before {
    content: attr(class);
    position: absolute;
    top: -12px;
    left: 8px;
    background: #3b82f6;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    z-index: 10;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* 🔥 ÍCONE DE MOVER - APARECE QUANDO PASSA O MOUSE */
  .outline-mode div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"]):hover::after {
    content: "⤸";
    position: absolute;
    top: -12px;
    right: 8px;
    background: #3b82f6;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    cursor: move;
    z-index: 20;
    transition: all 0.2s ease;
  }
  
  .outline-mode div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"]).draggable {
    cursor: move !important;
    opacity: 0.7 !important;
    border-style: solid !important;
    border-color: #ef4444 !important;
  }
  
  .outline-mode div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"]).drag-over {
    background-color: rgba(59, 130, 246, 0.1) !important;
    border-color: #10b981 !important;
    border-style: solid !important;
  }
  
  .outline-mode h1, 
  .outline-mode h2, 
  .outline-mode h3, 
  .outline-mode h4, 
  .outline-mode h5, 
  .outline-mode h6 {
    border: 2px dashed #10b981 !important;
    margin: 4px !important;
    padding: 8px !important;
    border-radius: 6px !important;
    position: relative !important;
  }
  
  .outline-mode h1::before, 
  .outline-mode h2::before, 
  .outline-mode h3::before, 
  .outline-mode h4::before, 
  .outline-mode h5::before, 
  .outline-mode h6::before {
    content: 'Heading';
    position: absolute;
    top: -12px;
    left: 8px;
    background: #10b981;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
  
  .outline-mode p {
    border: 2px dashed #6b7280 !important;
    margin: 4px !important;
    padding: 8px !important;
    border-radius: 6px !important;
    position: relative !important;
  }
  
  .outline-mode p::before {
    content: 'Paragraph';
    position: absolute;
    top: -12px;
    left: 8px;
    background: #6b7280;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
  
  .outline-mode img {
    border: 2px dashed #f59e0b !important;
    margin: 4px !important;
    padding: 4px !important;
    border-radius: 6px !important;
    position: relative !important;
  }
  
  .outline-mode img::before {
    content: 'Image';
    position: absolute;
    top: -12px;
    left: 8px;
    background: #f59e0b;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    z-index: 10;
  }
  
  .outline-mode a {
    border: 2px dashed #8b5cf6 !important;
    margin: 2px !important;
    padding: 2px 4px !important;
    border-radius: 4px !important;
    position: relative !important;
    display: inline-block !important;
  }
  
  .outline-mode a::before {
    content: 'Link';
    position: absolute;
    top: -16px;
    left: 0;
    background: #8b5cf6;
    color: white;
    font-size: 8px;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  /* Diferentes cores para níveis de profundidade */
  .outline-mode div > div {
    border-color: #60a5fa !important;
  }
  
  .outline-mode div > div > div {
    border-color: #93c5fd !important;
  }
  
  .outline-mode div > div > div > div {
    border-color: #bfdbfe !important;
  }
`;

// 🔥 CONTEÚDO INICIAL DO EDITOR
export const initialContent = `<p> Digite o Conteudo Aqui</p>`;