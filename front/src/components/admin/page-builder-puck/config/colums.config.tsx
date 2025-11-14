/**
 * Componente Columns - Sistema de colunas responsivas
 * Similar ao sistema de colunas do Elementor
 */

import type { ComponentConfig } from '@measured/puck';
import { DropZone } from '@measured/puck';
import type { StyleControls } from '../types/style-controls.types';
import { generateStyleClasses, generateInlineStyles } from '../utils/styleHelper';

/**
 * Configuração de uma coluna individual
 */
export interface ColumnConfig extends StyleControls {
  width?: string; // Largura customizada (ex: "33.33%", "auto", etc)
}

/**
 * Props do Columns
 */
export interface ColumnsProps {
  id: string;
  
  // Configuração de colunas
  numColumns: 2 | 3 | 4 | 5 | 6;
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12';
  verticalAlign?: 'start' | 'center' | 'end' | 'stretch';
  
  // Responsividade
  mobileColumns?: 1 | 2;
  tabletColumns?: 1 | 2 | 3 | 4;
  
  // Estilos do container de colunas
  containerStyles?: StyleControls;
  
  // Estilos individuais de cada coluna
  column1Styles?: ColumnConfig;
  column2Styles?: ColumnConfig;
  column3Styles?: ColumnConfig;
  column4Styles?: ColumnConfig;
  column5Styles?: ColumnConfig;
  column6Styles?: ColumnConfig;
}

/**
 * Configuração do Columns para o Puck
 */
export const ColumnsConfig: ComponentConfig<ColumnsProps> = {
  fields: {
    id: {
      type: 'text',
      label: 'ID das Colunas',
    },
    
    // ===== CONFIGURAÇÃO DE COLUNAS =====
    numColumns: {
      type: 'radio',
      label: 'Número de Colunas',
      options: [
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
        { label: '5 Colunas', value: 5 },
        { label: '6 Colunas', value: 6 },
      ],
    },
    
    gap: {
      type: 'select',
      label: 'Espaçamento entre Colunas',
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
      ],
    },
    
    verticalAlign: {
      type: 'radio',
      label: 'Alinhamento Vertical',
      options: [
        { label: 'Topo', value: 'start' },
        { label: 'Centro', value: 'center' },
        { label: 'Base', value: 'end' },
        { label: 'Esticar', value: 'stretch' },
      ],
    },
    
    // ===== RESPONSIVIDADE =====
    mobileColumns: {
      type: 'radio',
      label: 'Colunas no Mobile',
      options: [
        { label: '1 Coluna', value: 1 },
        { label: '2 Colunas', value: 2 },
      ],
    },
    
    tabletColumns: {
      type: 'radio',
      label: 'Colunas no Tablet',
      options: [
        { label: '1 Coluna', value: 1 },
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
      ],
    },
    
    // ===== ESTILOS DO CONTAINER =====
    containerStyles: {
      type: 'object',
      label: 'Estilos do Container',
      objectFields: {
        margin: {
          type: 'object',
          label: 'Margens',
          objectFields: {
            top: {
              type: 'select',
              label: 'Margem Superior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
                { label: '10', value: '10' },
                { label: '12', value: '12' },
              ],
            },
            bottom: {
              type: 'select',
              label: 'Margem Inferior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
                { label: '10', value: '10' },
                { label: '12', value: '12' },
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
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
                { label: '10', value: '10' },
              ],
            },
            bottom: {
              type: 'select',
              label: 'Padding Inferior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
                { label: '10', value: '10' },
              ],
            },
          },
        },
      },
    },
    
    // ===== ESTILOS COLUNA 1 =====
    column1Styles: {
      type: 'object',
      label: 'Estilos da Coluna 1',
      objectFields: {
        padding: {
          type: 'object',
          label: 'Padding',
          objectFields: {
            top: {
              type: 'select',
              label: 'Padding Superior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
              ],
            },
            bottom: {
              type: 'select',
              label: 'Padding Inferior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
              ],
            },
          },
        },
        background: {
          type: 'object',
          label: 'Fundo',
          objectFields: {
            color: {
              type: 'object',
              label: 'Cor',
              objectFields: {
                name: {
                  type: 'select',
                  label: 'Cor',
                  options: [
                    { label: 'Transparente', value: 'transparent' },
                    { label: 'Branco', value: 'white' },
                    { label: 'Cinza', value: 'gray' },
                    { label: 'Azul', value: 'blue' },
                    { label: 'Verde', value: 'green' },
                    { label: 'Vermelho', value: 'red' },
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
              },
            },
          },
        },
        border: {
          type: 'object',
          label: 'Bordas',
          objectFields: {
            radius: {
              type: 'select',
              label: 'Arredondamento',
              options: [
                { label: 'Nenhum', value: 'none' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ],
            },
            width: {
              type: 'select',
              label: 'Largura',
              options: [
                { label: 'Nenhuma', value: '0' },
                { label: '1px', value: '1' },
                { label: '2px', value: '2' },
                { label: '4px', value: '4' },
              ],
            },
          },
        },
      },
    },
    
    // ===== ESTILOS COLUNA 2 =====
    column2Styles: {
      type: 'object',
      label: 'Estilos da Coluna 2',
      objectFields: {
        padding: {
          type: 'object',
          label: 'Padding',
          objectFields: {
            top: {
              type: 'select',
              label: 'Padding Superior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
              ],
            },
            bottom: {
              type: 'select',
              label: 'Padding Inferior',
              options: [
                { label: '0', value: '0' },
                { label: '2', value: '2' },
                { label: '4', value: '4' },
                { label: '6', value: '6' },
                { label: '8', value: '8' },
              ],
            },
          },
        },
        background: {
          type: 'object',
          label: 'Fundo',
          objectFields: {
            color: {
              type: 'object',
              label: 'Cor',
              objectFields: {
                name: {
                  type: 'select',
                  label: 'Cor',
                  options: [
                    { label: 'Transparente', value: 'transparent' },
                    { label: 'Branco', value: 'white' },
                    { label: 'Cinza', value: 'gray' },
                    { label: 'Azul', value: 'blue' },
                    { label: 'Verde', value: 'green' },
                    { label: 'Vermelho', value: 'red' },
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
              },
            },
          },
        },
        border: {
          type: 'object',
          label: 'Bordas',
          objectFields: {
            radius: {
              type: 'select',
              label: 'Arredondamento',
              options: [
                { label: 'Nenhum', value: 'none' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ],
            },
            width: {
              type: 'select',
              label: 'Largura',
              options: [
                { label: 'Nenhuma', value: '0' },
                { label: '1px', value: '1' },
                { label: '2px', value: '2' },
                { label: '4px', value: '4' },
              ],
            },
          },
        },
      },
    },
    
    // Repetir para column3Styles, column4Styles, column5Styles, column6Styles
    // (Simplificando para não ficar muito longo - você pode copiar o padrão acima)
  },
  
  defaultProps: {
    id: '',
    numColumns: 2,
    gap: '4',
    verticalAlign: 'stretch',
    mobileColumns: 1,
    tabletColumns: 2,
    containerStyles: {
      margin: { top: '0', bottom: '0' },
      padding: { top: '0', bottom: '0' },
    },
    column1Styles: {
      padding: { top: '4', bottom: '4' },
      background: { color: { name: 'transparent' } },
      border: { radius: 'none', width: '0' },
    },
    column2Styles: {
      padding: { top: '4', bottom: '4' },
      background: { color: { name: 'transparent' } },
      border: { radius: 'none', width: '0' },
    },
  },
  
  render: (props) => {
    const {
      numColumns,
      gap,
      verticalAlign,
      mobileColumns,
      tabletColumns,
      containerStyles,
      column1Styles,
      column2Styles,
      column3Styles,
      column4Styles,
      column5Styles,
      column6Styles,
    } = props;
    
    // Classes do container
    const containerClasses = [
      'grid',
      `grid-cols-${mobileColumns}`, // Mobile first
      `md:grid-cols-${tabletColumns}`, // Tablet
      `lg:grid-cols-${numColumns}`, // Desktop
      gap !== '0' ? `gap-${gap}` : '',
      verticalAlign === 'center' ? 'items-center' : '',
      verticalAlign === 'end' ? 'items-end' : '',
      verticalAlign === 'stretch' ? 'items-stretch' : '',
      containerStyles ? generateStyleClasses(containerStyles) : '',
    ].filter(Boolean).join(' ');
    
    const containerInlineStyles = containerStyles 
      ? generateInlineStyles(containerStyles) 
      : {};
    
    // Array de estilos das colunas
    const columnStyles = [
      column1Styles,
      column2Styles,
      column3Styles,
      column4Styles,
      column5Styles,
      column6Styles,
    ];
    
    // Renderizar colunas
    const columns = Array.from({ length: numColumns }, (_, index) => {
      const colStyles = columnStyles[index];
      const colClasses = colStyles ? generateStyleClasses(colStyles) : '';
      const colInlineStyles = colStyles ? generateInlineStyles(colStyles) : {};
      
      return (
        <div
          key={`column-${index}`}
          className={`min-h-[100px] ${colClasses}`}
          style={colInlineStyles}
        >
          <DropZone zone={`column-${index + 1}`} />
        </div>
      );
    });
    
    return (
      <div className={containerClasses} style={containerInlineStyles}>
        {columns}
      </div>
    );
  },
};