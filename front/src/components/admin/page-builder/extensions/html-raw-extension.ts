import { Extension } from '@tiptap/core';

export const HTMLRawExtension = Extension.create({
  name: 'htmlRaw',

  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph',
          'heading', 
          'bulletList',
          'orderedList',
          'listItem',
          'divWithClasses'
        ],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) return {};
              return { class: attributes.class };
            },
          },
          style: {
            default: null,
            parseHTML: element => element.getAttribute('style'),
            renderHTML: attributes => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            },
          },
          // Adicione outros atributos específicos que você precisa
          xmlns: {
            default: null,
            parseHTML: element => element.getAttribute('xmlns'),
            renderHTML: attributes => {
              if (!attributes.xmlns) return {};
              return { xmlns: attributes.xmlns };
            },
          },
          viewBox: {
            default: null,
            parseHTML: element => element.getAttribute('viewBox'),
            renderHTML: attributes => {
              if (!attributes.viewBox) return {};
              return { viewBox: attributes.viewBox };
            },
          },
          fill: {
            default: null,
            parseHTML: element => element.getAttribute('fill'),
            renderHTML: attributes => {
              if (!attributes.fill) return {};
              return { fill: attributes.fill };
            },
          },
        },
      },
    ];
  },
});