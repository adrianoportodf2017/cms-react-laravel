import { Node } from '@tiptap/core';

export const SVGPathExtension = Node.create({
  name: 'svgPath',

  group: 'block',
  content: 'text*',
  inline: false,

  addAttributes() {
    return {
      d: {
        default: '',
      },
      fill: {
        default: 'currentColor',
      },
      'fill-rule': {
        default: null,
      },
      'clip-rule': {
        default: null,
      },
      stroke: {
        default: null,
      },
      'stroke-width': {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'path',
        getAttrs: (node) => {
          if (typeof node === 'string') return {};
          const element = node as HTMLElement;
          return {
            d: element.getAttribute('d'),
            fill: element.getAttribute('fill'),
            'fill-rule': element.getAttribute('fill-rule'),
            'clip-rule': element.getAttribute('clip-rule'),
            stroke: element.getAttribute('stroke'),
            'stroke-width': element.getAttribute('stroke-width'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['path', HTMLAttributes];
  },
});