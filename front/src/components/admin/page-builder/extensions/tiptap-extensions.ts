import { Extension, Node } from '@tiptap/react';

// 🔥 EXTENSÃO CUSTOMIZADA PARA PRESERVAR CLASSES TAILWIND
export const TailwindClasses = Extension.create({
  name: 'tailwindClasses',

  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph',
          'heading', 
          'bulletList',
          'orderedList',
          'listItem',
          'blockquote',
          'codeBlock',
          'horizontalRule',
          'hardBreak',
          'image',
          'textStyle',
          'divWithClasses' // Adicionei aqui
        ],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) {
                return {};
              }
              return {
                class: attributes.class
              };
            },
          },
        },
      },
    ];
  },
});

// 🔥 EXTENSÃO PARA DIVs COM CLASSES (ATUALIZADA)
export const DivWithClasses = Node.create({
  name: 'divWithClasses',

  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      class: {
        default: '',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: element => {
          const hasClasses = element.getAttribute('class');
          // Permite qualquer div com classes
          if (hasClasses) {
            return { class: hasClasses };
          }
          return null; // Retorna null para não capturar divs sem classes
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0];
  },
});

// 🔥 NOVA EXTENSÃO PARA PERMITIR SVG
export const SVGSupport = Extension.create({
  name: 'svgSupport',

  addGlobalAttributes() {
    return [
      {
        types: [
          'image',
          'divWithClasses'
        ],
        attributes: {
          // Permite todos os atributos necessários para SVG
          'xmlns': {
            default: null,
            parseHTML: element => element.getAttribute('xmlns'),
            renderHTML: attributes => {
              if (!attributes.xmlns) return {};
              return { xmlns: attributes.xmlns };
            },
          },
          'viewBox': {
            default: null,
            parseHTML: element => element.getAttribute('viewBox'),
            renderHTML: attributes => {
              if (!attributes.viewBox) return {};
              return { viewBox: attributes.viewBox };
            },
          },
          'fill': {
            default: null,
            parseHTML: element => element.getAttribute('fill'),
            renderHTML: attributes => {
              if (!attributes.fill) return {};
              return { fill: attributes.fill };
            },
          },
          'fill-rule': {
            default: null,
            parseHTML: element => element.getAttribute('fill-rule'),
            renderHTML: attributes => {
              if (!attributes['fill-rule']) return {};
              return { 'fill-rule': attributes['fill-rule'] };
            },
          },
          'clip-rule': {
            default: null,
            parseHTML: element => element.getAttribute('clip-rule'),
            renderHTML: attributes => {
              if (!attributes['clip-rule']) return {};
              return { 'clip-rule': attributes['clip-rule'] };
            },
          },
          'd': {
            default: null,
            parseHTML: element => element.getAttribute('d'),
            renderHTML: attributes => {
              if (!attributes.d) return {};
              return { d: attributes.d };
            },
          },
        },
      },
    ];
  },
});

// 🔥 EXTENSÃO PARA ELEMENTOS SVG
export const SVGElement = Node.create({
  name: 'svgElement',

  group: 'block',
  content: 'text*', // SVG pode conter texto ou ficar vazio
  inline: false,

  addAttributes() {
    return {
      xmlns: {
        default: 'http://www.w3.org/2000/svg',
      },
      class: {
        default: '',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
      viewBox: {
        default: '0 0 20 20',
        parseHTML: element => element.getAttribute('viewBox'),
        renderHTML: attributes => {
          if (!attributes.viewBox) return {};
          return { viewBox: attributes.viewBox };
        },
      },
      fill: {
        default: 'currentColor',
        parseHTML: element => element.getAttribute('fill'),
        renderHTML: attributes => {
          if (!attributes.fill) return {};
          return { fill: attributes.fill };
        },
      },
      // Adicione outros atributos SVG conforme necessário
    };
  },

  parseHTML() {
    return [
      {
        tag: 'svg',
        getAttrs: element => ({
          class: element.getAttribute('class'),
          viewBox: element.getAttribute('viewBox'),
          fill: element.getAttribute('fill'),
          xmlns: element.getAttribute('xmlns'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['svg', HTMLAttributes, 0];
  },
});

// 🔥 EXTENSÃO PARA ELEMENTOS PATH (dentro do SVG)
export const SVGPath = Node.create({
  name: 'svgPath',

  group: 'inline',
  content: 'text*',
  inline: true,

  addAttributes() {
    return {
      'fill-rule': {
        default: null,
        parseHTML: element => element.getAttribute('fill-rule'),
        renderHTML: attributes => {
          if (!attributes['fill-rule']) return {};
          return { 'fill-rule': attributes['fill-rule'] };
        },
      },
      'clip-rule': {
        default: null,
        parseHTML: element => element.getAttribute('clip-rule'),
        renderHTML: attributes => {
          if (!attributes['clip-rule']) return {};
          return { 'clip-rule': attributes['clip-rule'] };
        },
      },
      d: {
        default: '',
        parseHTML: element => element.getAttribute('d'),
        renderHTML: attributes => {
          if (!attributes.d) return {};
          return { d: attributes.d };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'path',
        getAttrs: element => ({
          d: element.getAttribute('d'),
          'fill-rule': element.getAttribute('fill-rule'),
          'clip-rule': element.getAttribute('clip-rule'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['path', HTMLAttributes];
  },
});