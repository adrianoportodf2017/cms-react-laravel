/**
 * Componente Container - Base para todos os layouts
 * Similar ao Container do Elementor
 */

import type { ComponentConfig } from '@measured/puck';
import { DropZone } from '@measured/puck';
import type { StyleControls } from '../types/style-controls.types';
import { generateStyleClasses, generateInlineStyles } from '../utils/styleHelper';

/**
 * Props do Container
 */
export interface ContainerProps extends StyleControls {
  id: string;
  
  // Configurações específicas do container
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  contentAlign?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'row' | 'column';
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';
  wrap?: boolean;
  
  // Link (se o container for clicável)
  link?: string;
  openInNewTab?: boolean;
}

/**
 * Configuração do Container para o Puck
 */
export const ContainerConfig: ComponentConfig<ContainerProps> = {
  fields: {
    id: {
      type: 'text',
      label: 'ID do Container',
    },
    // ===== CONTEÚDO =====
    maxWidth: {
      type: 'select',
      label: 'Largura Máxima',
      options: [
        { label: 'Nenhuma', value: 'none' },
        { label: 'Pequena (640px)', value: 'sm' },
        { label: 'Média (768px)', value: 'md' },
        { label: 'Grande (1024px)', value: 'lg' },
        { label: 'Extra Grande (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
        { label: '5XL', value: '5xl' },
        { label: '6XL', value: '6xl' },
        { label: '7XL', value: '7xl' },
        { label: 'Largura Total', value: 'full' },
      ],
    },
    
    contentAlign: {
      type: 'radio',
      label: 'Alinhamento do Conteúdo',
      options: [
        { label: 'Início', value: 'start' },
        { label: 'Centro', value: 'center' },
        { label: 'Fim', value: 'end' },
        { label: 'Esticar', value: 'stretch' },
      ],
    },
    
    direction: {
      type: 'radio',
      label: 'Direção',
      options: [
        { label: 'Horizontal', value: 'row' },
        { label: 'Vertical', value: 'column' },
      ],
    },
    
    gap: {
      type: 'select',
      label: 'Espaçamento entre itens',
      options: [
        { label: 'Nenhum', value: '0' },
        { label: 'XS (0.25rem)', value: '1' },
        { label: 'SM (0.5rem)', value: '2' },
        { label: 'MD (0.75rem)', value: '3' },
        { label: 'LG (1rem)', value: '4' },
        { label: 'XL (1.25rem)', value: '5' },
        { label: '2XL (1.5rem)', value: '6' },
        { label: '3XL (2rem)', value: '8' },
        { label: '4XL (2.5rem)', value: '10' },
        { label: '5XL (3rem)', value: '12' },
        { label: '6XL (4rem)', value: '16' },
        { label: '7XL (5rem)', value: '20' },
        { label: '8XL (6rem)', value: '24' },
      ],
    },
    
    wrap: {
      type: 'radio',
      label: 'Quebrar linha',
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
      ],
    },
    
    // ===== LINK =====
    link: {
      type: 'text',
      label: 'Link (opcional)',
    },
    
    openInNewTab: {
      type: 'radio',
      label: 'Abrir em nova aba',
      options: [
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
      ],
    },
    
    // ===== ESPAÇAMENTO =====
    margin: {
      type: 'object',
      label: 'Margens',
      objectFields: {
        top: {
          type: 'select',
          label: 'Margem Superior',
          options: [
            { label: '0', value: '0' },
            { label: '1 (0.25rem)', value: '1' },
            { label: '2 (0.5rem)', value: '2' },
            { label: '3 (0.75rem)', value: '3' },
            { label: '4 (1rem)', value: '4' },
            { label: '5 (1.25rem)', value: '5' },
            { label: '6 (1.5rem)', value: '6' },
            { label: '8 (2rem)', value: '8' },
            { label: '10 (2.5rem)', value: '10' },
            { label: '12 (3rem)', value: '12' },
            { label: '16 (4rem)', value: '16' },
            { label: '20 (5rem)', value: '20' },
            { label: '24 (6rem)', value: '24' },
          ],
        },
        bottom: {
          type: 'select',
          label: 'Margem Inferior',
          options: [
            { label: '0', value: '0' },
            { label: '1 (0.25rem)', value: '1' },
            { label: '2 (0.5rem)', value: '2' },
            { label: '3 (0.75rem)', value: '3' },
            { label: '4 (1rem)', value: '4' },
            { label: '5 (1.25rem)', value: '5' },
            { label: '6 (1.5rem)', value: '6' },
            { label: '8 (2rem)', value: '8' },
            { label: '10 (2.5rem)', value: '10' },
            { label: '12 (3rem)', value: '12' },
            { label: '16 (4rem)', value: '16' },
            { label: '20 (5rem)', value: '20' },
            { label: '24 (6rem)', value: '24' },
          ],
        },
      },
    },
    
    padding: {
      type: 'object',
      label: 'Paddings',
      objectFields: {
        top: {
          type: 'select',
          label: 'Padding Superior',
          options: [
            { label: '0', value: '0' },
            { label: '1 (0.25rem)', value: '1' },
            { label: '2 (0.5rem)', value: '2' },
            { label: '3 (0.75rem)', value: '3' },
            { label: '4 (1rem)', value: '4' },
            { label: '5 (1.25rem)', value: '5' },
            { label: '6 (1.5rem)', value: '6' },
            { label: '8 (2rem)', value: '8' },
            { label: '10 (2.5rem)', value: '10' },
            { label: '12 (3rem)', value: '12' },
            { label: '16 (4rem)', value: '16' },
            { label: '20 (5rem)', value: '20' },
            { label: '24 (6rem)', value: '24' },
          ],
        },
        bottom: {
          type: 'select',
          label: 'Padding Inferior',
          options: [
            { label: '0', value: '0' },
            { label: '1 (0.25rem)', value: '1' },
            { label: '2 (0.5rem)', value: '2' },
            { label: '3 (0.75rem)', value: '3' },
            { label: '4 (1rem)', value: '4' },
            { label: '5 (1.25rem)', value: '5' },
            { label: '6 (1.5rem)', value: '6' },
            { label: '8 (2rem)', value: '8' },
            { label: '10 (2.5rem)', value: '10' },
            { label: '12 (3rem)', value: '12' },
            { label: '16 (4rem)', value: '16' },
            { label: '20 (5rem)', value: '20' },
            { label: '24 (6rem)', value: '24' },
          ],
        },
      },
    },
    
    // ===== BACKGROUND =====
    background: {
      type: 'object',
      label: 'Fundo',
      objectFields: {
        color: {
          type: 'object',
          label: 'Cor de Fundo',
          objectFields: {
            name: {
              type: 'select',
              label: 'Cor de Fundo',
              options: [
                { label: 'Transparente', value: 'transparent' },
                { label: 'Branco', value: 'white' },
                { label: 'Preto', value: 'black' },
                { label: 'Cinza', value: 'gray' },
                { label: 'Vermelho', value: 'red' },
                { label: 'Laranja', value: 'orange' },
                { label: 'Amarelo', value: 'yellow' },
                { label: 'Verde', value: 'green' },
                { label: 'Azul', value: 'blue' },
                { label: 'Índigo', value: 'indigo' },
                { label: 'Roxo', value: 'purple' },
                { label: 'Rosa', value: 'pink' },
              ],
            },
            shade: {
              type: 'select',
              label: 'Tonalidade',
              options: [
                { label: '50', value: '50' },
                { label: '100', value: '100' },
                { label: '200', value: '200' },
                { label: '300', value: '300' },
                { label: '400', value: '400' },
                { label: '500', value: '500' },
                { label: '600', value: '600' },
                { label: '700', value: '700' },
                { label: '800', value: '800' },
                { label: '900', value: '900' },
              ],
            },
            custom: {
              type: 'text',
              label: 'Cor Customizada (hex)',
            },
          },
        },
      },
    },
    
    // ===== BORDAS =====
    border: {
      type: 'object',
      label: 'Bordas',
      objectFields: {
        radius: {
          type: 'select',
          label: 'Arredondamento',
          options: [
            { label: 'Nenhum', value: 'none' },
            { label: 'Pequeno', value: 'sm' },
            { label: 'Médio', value: 'md' },
            { label: 'Grande', value: 'lg' },
            { label: 'Extra Grande', value: 'xl' },
            { label: '2XL', value: '2xl' },
            { label: '3XL', value: '3xl' },
            { label: 'Completo', value: 'full' },
          ],
        },
        width: {
          type: 'select',
          label: 'Largura da Borda',
          options: [
            { label: 'Nenhuma', value: '0' },
            { label: '1px', value: '1' },
            { label: '2px', value: '2' },
            { label: '4px', value: '4' },
            { label: '8px', value: '8' },
          ],
        },
        color: {
          type: 'object',
          label: 'Cor da Borda',
          objectFields: {
            name: {
              type: 'select',
              label: 'Cor da Borda',
              options: [
                { label: 'Cinza', value: 'gray' },
                { label: 'Vermelho', value: 'red' },
                { label: 'Laranja', value: 'orange' },
                { label: 'Amarelo', value: 'yellow' },
                { label: 'Verde', value: 'green' },
                { label: 'Azul', value: 'blue' },
                { label: 'Roxo', value: 'purple' },
              ],
            },
          },
        },
      },
    },
    
    // ===== EFEITOS =====
    shadow: {
      type: 'select',
      label: 'Sombra',
      options: [
        { label: 'Nenhuma', value: 'none' },
        { label: 'Pequena', value: 'sm' },
        { label: 'Média', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
        { label: '2XL', value: '2xl' },
      ],
    },
  },
  
  defaultProps: {
    id: '',
    maxWidth: 'full',
    contentAlign: 'start',
    direction: 'column',
    gap: '0',
    wrap: false,
    margin: { top: '0', bottom: '0' },
    padding: { top: '8', bottom: '8' },
    background: { color: { name: 'transparent' } },
    border: { radius: 'none', width: '0' },
    shadow: 'none',
  },
  
  render: (props) => {
    const {
      maxWidth,
      contentAlign,
      direction,
      gap,
      wrap,
      link,
      openInNewTab,
      ...styleProps
    } = props;
    
    // Gera classes de estilo
    const styleClasses = generateStyleClasses(styleProps as StyleControls);
    const inlineStyles = generateInlineStyles(styleProps as StyleControls);
    
    // Classes específicas do container
    const containerClasses = [
      styleClasses,
      maxWidth !== 'none' && maxWidth !== 'full' ? `max-w-${maxWidth} mx-auto` : '',
      maxWidth === 'full' ? 'w-full' : '',
      direction === 'row' ? 'flex flex-row' : 'flex flex-col',
      contentAlign === 'center' ? 'items-center' : '',
      contentAlign === 'end' ? 'items-end' : '',
      contentAlign === 'stretch' ? 'items-stretch' : '',
      gap !== '0' ? `gap-${gap}` : '',
      wrap ? 'flex-wrap' : '',
    ].filter(Boolean).join(' ');
    
    // ✅ MUDANÇA PRINCIPAL: Usar DropZone ao invés de children
    const content = <DropZone zone="container-content" />;
    
    // Se tiver link, renderiza como <a>
    if (link) {
      return (
        <a
          href={link}
          target={openInNewTab ? '_blank' : '_self'}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className={containerClasses}
          style={inlineStyles}
        >
          {content}
        </a>
      );
    }
    
    // Senão, renderiza como <div>
    return (
      <div className={containerClasses} style={inlineStyles}>
        {content}
      </div>
    );
  },
};