// src/components/admin/page-builder/fields/index.ts

import type { Fields } from '@measured/puck';

/**
 * 🎨 COLOR PICKER REUTILIZÁVEL
 */
export const colorPickerField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }: any) => {
    const colors = [
      ['transparent', '#FFFFFF', '#000000', '#F3F4F6', '#E5E7EB'],
      ['#EFF6FF', '#DBEAFE', '#93C5FD', '#3B82F6', '#1E40AF'],
      ['#F0FDF4', '#BBF7D0', '#4ADE80', '#16A34A', '#166534'],
      ['#FEF2F2', '#FECACA', '#F87171', '#DC2626', '#991B1B'],
      ['#FEFCE8', '#FEF08A', '#FACC15', '#CA8A04', '#854D0E'],
      ['#FAF5FF', '#E9D5FF', '#C084FC', '#9333eaff', '#6B21A8'],
      ['#FDF2F8', '#FBCFE8', '#F472B6', '#DB2777', '#9D174D'],
      ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#9A3412'],
    ];

    return (
      <div className="space-y-2">
        <input
          type="text"
          value={value || 'transparent'}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: #FF5733 ou transparent"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        
        <div className="grid grid-cols-5 gap-2">
          {colors.flat().map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`
                w-full h-10 rounded border-2 transition-all
                ${value === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}
              `}
              style={{ 
                backgroundColor: color === 'transparent' ? 'white' : color,
                backgroundImage: color === 'transparent' 
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                  : undefined,
                backgroundSize: color === 'transparent' ? '10px 10px' : undefined,
                backgroundPosition: color === 'transparent' ? '0 0, 5px 5px' : undefined,
              }}
              title={color}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-gray-600">Selecionada:</span>
          <div 
            className="w-8 h-8 rounded border border-gray-300"
            style={{ 
              backgroundColor: value || 'transparent',
              backgroundImage: (value === 'transparent' || !value)
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                : undefined,
              backgroundSize: (value === 'transparent' || !value) ? '8px 8px' : undefined,
              backgroundPosition: (value === 'transparent' || !value) ? '0 0, 4px 4px' : undefined,
            }}
          />
          <span className="text-sm font-mono text-gray-700">{value || 'transparent'}</span>
        </div>
      </div>
    );
  }
});

/**
 * 📏 CAMPOS DE TIPOGRAFIA
 */
export const typographyFields = {
  fontSize: {
    type: 'select' as const,
    label: '🖥️ Tamanho da Fonte (Desktop)',
    options: [
      { label: '12px', value: '12px' },
      { label: '14px', value: '14px' },
      { label: '16px', value: '16px' },
      { label: '18px', value: '18px' },
      { label: '20px', value: '20px' },
      { label: '24px', value: '24px' },
      { label: '28px', value: '28px' },
      { label: '32px', value: '32px' },
      { label: '36px', value: '36px' },
      { label: '40px', value: '40px' },
      { label: '48px', value: '48px' },
      { label: '56px', value: '56px' },
      { label: '60px', value: '60px' },
    ],
  },
  fontSizeMobile: {
    type: 'select' as const,
    label: '📱 Tamanho da Fonte (Mobile)',
    options: [
      { label: 'Mesmo do Desktop', value: 'inherit' },
      { label: '10px', value: '10px' },
      { label: '12px', value: '12px' },
      { label: '14px', value: '14px' },
      { label: '16px', value: '16px' },
      { label: '18px', value: '18px' },
      { label: '20px', value: '20px' },
      { label: '24px', value: '24px' },
      { label: '28px', value: '28px' },
      { label: '32px', value: '32px' },
    ],
  },
  alignment: {
    type: 'radio' as const,
    label: '🖥️ Alinhamento (Desktop)',
    options: [
      { label: 'Esquerda', value: 'left' },
      { label: 'Centro', value: 'center' },
      { label: 'Direita', value: 'right' },
      { label: 'Justificado', value: 'justify' },
    ],
  },
  alignmentMobile: {
    type: 'radio' as const,
    label: '📱 Alinhamento (Mobile)',
    options: [
      { label: 'Mesmo do Desktop', value: 'inherit' },
      { label: 'Esquerda', value: 'left' },
      { label: 'Centro', value: 'center' },
      { label: 'Direita', value: 'right' },
      { label: 'Justificado', value: 'justify' },
    ],
  },
} satisfies Fields;

/**
 * 📐 CAMPOS DE ESPAÇAMENTO
 */
export const spacingFields = {
  margin: {
    type: 'object' as const,
    label: 'Margem',
    objectFields: {
      top: { type: 'text' as const, label: 'Superior' },
      right: { type: 'text' as const, label: 'Direita' },
      bottom: { type: 'text' as const, label: 'Inferior' },
      left: { type: 'text' as const, label: 'Esquerda' },
    },
  },
  padding: {
    type: 'object' as const,
    label: 'Preenchimento',
    objectFields: {
      top: { type: 'text' as const, label: 'Superior' },
      right: { type: 'text' as const, label: 'Direita' },
      bottom: { type: 'text' as const, label: 'Inferior' },
      left: { type: 'text' as const, label: 'Esquerda' },
    },
  },
} satisfies Fields;

/**
 * 📏 CAMPOS DE DIMENSÕES
 */
export const dimensionFields = {
  width: {
    type: 'select' as const,
    label: 'Largura',
    options: [
      { label: 'Padrão', value: 'auto' },
      { label: '25%', value: '25%' },
      { label: '50%', value: '50%' },
      { label: '75%', value: '75%' },
      { label: '100%', value: '100%' },
    ],
  },
  maxWidth: {
    type: 'select' as const,
    label: 'Largura Máxima',
    options: [
      { label: 'Nenhuma', value: 'none' },
      { label: '640px', value: '640px' },
      { label: '768px', value: '768px' },
      { label: '1024px', value: '1024px' },
      { label: '1280px', value: '1280px' },
      { label: '1536px', value: '1536px' },
    ],
  },
} satisfies Fields;

/**
 * 👁️ CAMPOS DE VISIBILIDADE
 */
export const visibilityFields = {
  hiddenMobile: {
    type: 'radio' as const,
    label: '📱 Ocultar no Mobile',
    options: [
      { label: 'Não', value: false },
      { label: 'Sim', value: true },
    ],
  },
  hiddenTablet: {
    type: 'radio' as const,
    label: '💻 Ocultar no Tablet',
    options: [
      { label: 'Não', value: false },
      { label: 'Sim', value: true },
    ],
  },
  hiddenDesktop: {
    type: 'radio' as const,
    label: '🖥️ Ocultar no Desktop',
    options: [
      { label: 'Não', value: false },
      { label: 'Sim', value: true },
    ],
  },
} satisfies Fields;

/**
 * 🎨 CAMPOS DE ESTILO
 */
export const styleFields = {
  backgroundColor: colorPickerField('Cor de Fundo'),
  borderRadius: {
    type: 'text' as const,
    label: 'Arredondamento (ex: 8px)',
  },
  zIndex: {
    type: 'text' as const,
    label: 'Z-Index',
  },
  customClasses: {
    type: 'text' as const,
    label: 'Classes CSS',
  },
} satisfies Fields;

/**
 * 🎯 PROPS PADRÃO - TIPOGRAFIA
 */
export const defaultTypographyProps = {
  fontSize: '16px',
  fontSizeMobile: 'inherit',
  alignment: 'left',
  alignmentMobile: 'inherit',
};

/**
 * 🎯 PROPS PADRÃO - ESPAÇAMENTO
 */
export const defaultSpacingProps = {
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  padding: { top: '16px', right: '0', bottom: '16px', left: '0' },
};

/**
 * 🎯 PROPS PADRÃO - DIMENSÕES
 */
export const defaultDimensionProps = {
  width: '100%',
  maxWidth: 'none',
};

/**
 * 🎯 PROPS PADRÃO - VISIBILIDADE
 */
export const defaultVisibilityProps = {
  hiddenMobile: false,
  hiddenTablet: false,
  hiddenDesktop: false,
};

/**
 * 🎯 PROPS PADRÃO - ESTILO
 */
export const defaultStyleProps = {
  backgroundColor: 'transparent',
  borderRadius: '0px',
  zIndex: 'auto',
  customClasses: '',
};

/**
 * 🔧 HELPER: Adiciona unidade px se necessário
 */
export const addUnit = (value: string | undefined) => {
  if (!value || value === '0' || value === 'auto') return value || '0';
  if (/\d+(px|%|em|rem|vh|vw)$/.test(value)) return value;
  return `${value}px`;
};

/**
 * 🔧 HELPER: Gera classes de visibilidade
 */
export const getVisibilityClasses = (
  hiddenMobile?: boolean,
  hiddenTablet?: boolean,
  hiddenDesktop?: boolean
) => {
  return [
    hiddenMobile ? 'hidden sm:block' : '',
    hiddenTablet ? 'sm:hidden md:block' : '',
    hiddenDesktop ? 'lg:hidden' : '',
  ].filter(Boolean).join(' ');
};

/**
 * 🔧 HELPER: Gera CSS responsivo
 */
export const generateResponsiveStyles = (
  uniqueId: string,
  fontSize: string,
  fontSizeMobile: string,
  alignment: string,
  alignmentMobile: string
) => {
  return `
    .${uniqueId} .richtext-content {
      font-size: ${fontSize};
      text-align: ${alignment};
    }
    
    @media (max-width: 640px) {
      .${uniqueId} .richtext-content {
        font-size: ${fontSizeMobile !== 'inherit' ? fontSizeMobile : fontSize};
        text-align: ${alignmentMobile !== 'inherit' ? alignmentMobile : alignment};
      }
    }
  `;
};