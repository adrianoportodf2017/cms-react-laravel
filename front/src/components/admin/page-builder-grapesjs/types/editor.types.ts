// src/components/admin/page-builder-grapesjs/types/editor.types.ts

import type { Editor, Asset } from 'grapesjs';

/**
 * Re-exporta o tipo Editor do GrapesJS
 */
export type GrapesJSEditor = Editor;

/**
 * Tipos para Asset do GrapesJS
 * Usando o tipo nativo e estendendo conforme necessário
 */
export interface GrapesJSAssetProps {
  src: string;
  type?: string;
  name?: string;
  id?: string;
  height?: number;
  width?: number;
  [key: string]: any; // Index signature necessária
}

export interface DeviceConfig {
  id: string;
  name: string;
  width: string;
}

export interface EditorConfig {
  container: string;
  height: string;
  fromElement: boolean;
  storageManager: boolean;
  selectorManager: any;
  forceClass: boolean;
  avoidInlineStyle: boolean;
  plugins: any[];
  pluginsOpts: any;
  deviceManager: { devices: DeviceConfig[] };
  canvas: { styles: string[] };
}

/**
 * Type helper para plugin do GrapesJS
 */
export type GrapesPlugin = ((editor: Editor) => void) | any;

/**
 * Tipo para comandos customizados
 */
export interface CustomCommand {
  run: (editor: Editor, sender?: any, options?: any) => any;
  stop?: (editor: Editor, sender?: any, options?: any) => any;
  [key: string]: any; // Index signature necessária
}