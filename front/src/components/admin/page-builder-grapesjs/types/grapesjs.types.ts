// src/components/admin/page-builder-grapesjs/types/grapesjs.types.ts
import type { Editor } from 'grapesjs';

// Extende o tipo Editor do GrapesJS para adicionar propriedades customizadas
export type GrapesJSEditor = Editor;

export type GrapesPlugin = (editor: Editor, options?: Record<string, unknown>) => void;


export interface GrapesAsset {
  src: string;
  name?: string;
  type: 'image' | 'video' | 'document';
  width?: number;
  height?: number;
}

export interface GrapesUploadResponse {
  data: GrapesAsset[];
}

export interface LaravelMediaResponse {
  success: boolean;
  message?: string;
  data: {
    id: number;
    url: string;
    filename: string;
    title?: string;
    type: string;
    mime_type: string;
    size: number;
    width?: number;
    height?: number;
  };
}

export interface AssetManagerConfig {
  upload: string;
  uploadName: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  embedAsBase64: boolean;
  autoAdd: number;
  multiUpload: boolean;
  uploadFile?: (e: any) => Promise<GrapesUploadResponse>;
  modalTitle?: string;
  uploadText?: string;
  addBtnText?: string;
  assets?: GrapesAsset[];
}

export interface GrapesEditor {
  AssetManager: {
    add: (assets: GrapesAsset[]) => void;
    getAll: () => GrapesAsset[];
  };
  SelectorManager: {
    add: (selector: any) => any;
    getSelected: () => any[];
  };
  BlockManager: {
    add: (id: string, config: any) => void;
  };
  Commands: {
    add: (id: string, config: any) => void;
  };
  Panels: {
    getPanel: (id: string) => any;
    addButton: (panelId: string, config: any) => void;
    getButton: (panelId: string, buttonId: string) => any;
  };
  Canvas: {
    getFrameEl: () => HTMLIFrameElement | null;
  };
  Modal: {
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    open: () => void;
    close: () => void;
  };
  CssComposer: {
    getAllToHtml: () => string;
  };
  getWrapper: () => any;
  getHtml: () => string;
  getCss: () => string;
  getProjectData: () => any;
  setComponents: (html: string) => void;
  setStyle: (css: string) => void;
  setDevice: (device: string) => void;
  getDevice: () => string;
  on: (event: string, callback: (data?: any) => void) => void;
  destroy: () => void;
}

