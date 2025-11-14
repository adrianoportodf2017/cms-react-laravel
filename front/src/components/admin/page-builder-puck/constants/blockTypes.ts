/**
 * Constantes relacionadas aos tipos de blocos
 */

import { BlockType as BT, BlockCategory as BC } from '../types';

/**
 * Mapeamento de tipos de blocos para suas categorias
 */
export const BLOCK_CATEGORIES: Record<string, string> = {
  [BT.HERO]: BC.LAYOUT,
  [BT.TEXT]: BC.CONTENT,
  [BT.IMAGE]: BC.MEDIA,
  [BT.CARD_GRID]: BC.LAYOUT,
  [BT.CALL_TO_ACTION]: BC.CONTENT,
  [BT.SPACER]: BC.LAYOUT,
  [BT.DIVIDER]: BC.LAYOUT,
  [BT.VIDEO]: BC.MEDIA,
  [BT.GALLERY]: BC.MEDIA,
  [BT.FORM]: BC.FORMS,
};

/**
 * Labels dos tipos de blocos
 */
export const BLOCK_LABELS: Record<string, string> = {
  [BT.HERO]: 'Seção Hero',
  [BT.TEXT]: 'Texto',
  [BT.IMAGE]: 'Imagem',
  [BT.CARD_GRID]: 'Grid de Cards',
  [BT.CALL_TO_ACTION]: 'Call to Action',
  [BT.SPACER]: 'Espaçador',
  [BT.DIVIDER]: 'Divisor',
  [BT.VIDEO]: 'Vídeo',
  [BT.GALLERY]: 'Galeria',
  [BT.FORM]: 'Formulário',
};

/**
 * Descrições dos tipos de blocos
 */
export const BLOCK_DESCRIPTIONS: Record<string, string> = {
  [BT.HERO]: 'Seção destacada com título, subtítulo e imagem de fundo',
  [BT.TEXT]: 'Bloco de texto rico com formatação',
  [BT.IMAGE]: 'Imagem única com opções de alinhamento',
  [BT.CARD_GRID]: 'Grade de cards para exibir conteúdo em colunas',
  [BT.CALL_TO_ACTION]: 'Botão ou link de chamada para ação',
  [BT.SPACER]: 'Espaçamento vertical entre blocos',
  [BT.DIVIDER]: 'Linha divisória horizontal',
  [BT.VIDEO]: 'Vídeo incorporado (YouTube, Vimeo, etc)',
  [BT.GALLERY]: 'Galeria de imagens com lightbox',
  [BT.FORM]: 'Formulário de contato ou cadastro',
};

/**
 * Labels das categorias de blocos
 */
export const CATEGORY_LABELS: Record<string, string> = {
  [BC.LAYOUT]: 'Layout',
  [BC.CONTENT]: 'Conteúdo',
  [BC.MEDIA]: 'Mídia',
  [BC.FORMS]: 'Formulários',
  [BC.ADVANCED]: 'Avançado',
};

/**
 * Ícones das categorias (usando emojis como placeholder)
 * Depois você pode trocar por componentes de ícone reais
 */
export const CATEGORY_ICONS: Record<string, string> = {
  [BC.LAYOUT]: '📐',
  [BC.CONTENT]: '📝',
  [BC.MEDIA]: '🎨',
  [BC.FORMS]: '📋',
  [BC.ADVANCED]: '⚙️',
};

/**
 * Blocos que devem aparecer primeiro na lista
 */
/**
 * Blocos que devem aparecer primeiro na lista
 */
export const FEATURED_BLOCKS: string[] = [
  BT.HERO,
  BT.TEXT,
  BT.IMAGE,
  BT.CARD_GRID,
];

/**
 * Blocos que requerem configuração avançada
 */
export const ADVANCED_BLOCKS: string[] = [
  BT.FORM,
  BT.VIDEO,
  BT.GALLERY,
];