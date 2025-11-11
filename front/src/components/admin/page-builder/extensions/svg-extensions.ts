import { Node } from '@tiptap/core';

export const SVGExtension = Node.create({
  name: 'svg',

  group: 'block',
  content: 'svgPath*', // Agora aceita svgPath como conteúdo
  inline: false,

  addAttributes() {
    return {
      xmlns: {
        default: 'http://www.w3.org/2000/svg',
      },
      viewBox: {
        default: '0 0 20 20',
      },
      fill: {
        default: 'currentColor',
      },
      class: {
        default: '',
      },
      width: {
        default: '24',
      },
      height: {
        default: '24',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'svg',
        getAttrs: (node) => {
          if (typeof node === 'string') return {};
          const element = node as HTMLElement;
          return {
            xmlns: element.getAttribute('xmlns'),
            viewBox: element.getAttribute('viewBox'),
            fill: element.getAttribute('fill'),
            class: element.getAttribute('class'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
          };
        },
        contentElement: (node) => {
          const element = node as HTMLElement;
          return element;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['svg', HTMLAttributes, 0];
  },
});