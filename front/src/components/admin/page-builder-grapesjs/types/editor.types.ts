// src/components/admin/page-builder-grapesjs/types/editor.types.ts

import type { Editor, Asset as GrapesAsset } from 'grapesjs';

/**
 * Re-exporta o tipo Editor do GrapesJS
 */
export type GrapesJSEditor = Editor;

// Alias para o tipo Asset do GrapesJS, que pode ser reexportado no useGrapesEditor
export type Asset = GrapesAsset;

// Definindo explicitamente a estrutura dos dados da API de Mídia, para validação local
// O GrapesJS Asset geralmente herda de Model, mas usamos GrapesAsset acima.
// Essa interface ajuda a tipar os dados brutos da sua API.
export interface MediaAsset {
    id: number;
    url: string;
    type: string;
    title: string | null;
    filename: string;
    // CORREÇÃO: Campos que podem vir da API como null
    height: number | null; 
    width: number | null; 
}

/**
 * Tipos para Component (Modelo GrapesJS)
 */
export type Component = GrapesJSEditor['DomComponents']['Component'];

/**
 * Tipos para Resizable Events e Options (para tipagem avançada no hook)
 */
// Tipo da função de updateTarget
export type ResizableUpdateTarget = (el: HTMLElement, rect: { w: number, h: number }) => void;

// Tipo do evento onEnd
export type ResizableOnEnd = (e: any, opts: { w: number, h: number, target: Component }) => void;

// Tipo das opções
export interface ResizableOptions {
    tl: number; tc: number; tr: number;
    cl: number; cr: number;
    bl: number; bc: number; br: number;
    keyWidth: string;
    keyHeight: string;
    updateTarget: ResizableUpdateTarget;
    onEnd: ResizableOnEnd;
    [key: string]: any; 
}
export type ResizableEvent = any;

/**
 * Tipo para View (Usado para BlockManager/Categories)
 */
export type View = GrapesJSEditor['BlockManager']['Categories'] extends { models: infer T } ? (T extends Array<infer U> ? U : any) : any;


// --- Configurações Menos Críticas (Manutenção de estrutura) ---

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


// Definição de tipo para os dados de mídia retornados da API
export interface MediaAsset {
    id: number;
    url: string;
    type: string;
    title: string | null;
    filename: string;
    // CORREÇÃO: Permite number ou null
    height: number | null; 
    width: number | null; 
}

// ----------------------------------------------------------------------
// EXPORTS DO useGrapesEditor (Mantenha o que o hook precisa)
// ----------------------------------------------------------------------
 // Exporte todos os tipos necessários para uso no hook