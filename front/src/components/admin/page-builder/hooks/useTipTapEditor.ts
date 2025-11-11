import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TailwindClasses, DivWithClasses } from '../extensions/tiptap-extensions';
import { SVGExtension } from '../extensions/svg-extensions';
import { SVGPathExtension } from '../extensions/path-extensions';
import { initialContent } from '../constants/editor-constants';

type UseTipTapEditorProps = {
  showOutline?: boolean;
};

export const useTipTapEditor = ({ showOutline }: UseTipTapEditorProps) => {
  return useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: null,
          },
        },
        heading: {
          HTMLAttributes: {
            class: null,
          },
        },
      }),
      TailwindClasses,
      DivWithClasses,
      SVGExtension,
      SVGPathExtension, // Adicione esta linha
      (Highlight as any),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: null,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `min-h-[500px] p-4 focus:outline-none ${showOutline ? 'outline-mode' : ''}`,
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });
};