/**
 * Helper para converter StyleControls em classes Tailwind CSS
 */

import type {
  StyleControls,
  SpacingConfig,
  TypographyConfig,
  ColorConfig,
  BorderConfig,
  BackgroundConfig,
} from '../types/style-controls.types';

/**
 * Gera classes de espaçamento (margin ou padding)
 */
const generateSpacingClasses = (
  type: 'm' | 'p',
  spacing?: SpacingConfig
): string => {
  if (!spacing) return '';
  
  const classes: string[] = [];
  
  if (spacing.top) classes.push(`${type}t-${spacing.top}`);
  if (spacing.right) classes.push(`${type}r-${spacing.right}`);
  if (spacing.bottom) classes.push(`${type}b-${spacing.bottom}`);
  if (spacing.left) classes.push(`${type}l-${spacing.left}`);
  
  return classes.join(' ');
};

/**
 * Gera classes de tipografia
 */
const generateTypographyClasses = (typography?: TypographyConfig): string => {
  if (!typography) return '';
  
  const classes: string[] = [];
  
  if (typography.fontSize) classes.push(`text-${typography.fontSize}`);
  if (typography.fontWeight) classes.push(`font-${typography.fontWeight}`);
  if (typography.textAlign) classes.push(`text-${typography.textAlign}`);
  if (typography.lineHeight) classes.push(`leading-${typography.lineHeight}`);
  if (typography.letterSpacing) classes.push(`tracking-${typography.letterSpacing}`);
  
  // Estilos de texto
  if (typography.textStyle) {
    if (typography.textStyle.italic) classes.push('italic');
    if (typography.textStyle.underline) classes.push('underline');
    if (typography.textStyle.uppercase) classes.push('uppercase');
    if (typography.textStyle.lowercase) classes.push('lowercase');
    if (typography.textStyle.capitalize) classes.push('capitalize');
  }
  
  return classes.join(' ');
};

/**
 * Gera classe de cor
 */
const generateColorClass = (
  prefix: string,
  color?: ColorConfig
): string => {
  if (!color) return '';
  
  // Se for cor customizada (hex)
  if (color.custom) {
    return ''; // Será aplicado via style inline
  }
  
  // Cores especiais
  if (color.name === 'white') return `${prefix}-white`;
  if (color.name === 'black') return `${prefix}-black`;
  if (color.name === 'transparent') return `${prefix}-transparent`;
  
  // Cor com shade
  if (color.shade) {
    return `${prefix}-${color.name}-${color.shade}`;
  }
  
  // Cor sem shade (usa 500 como padrão)
  return `${prefix}-${color.name}-500`;
};

/**
 * Gera classes de borda
 */
const generateBorderClasses = (border?: BorderConfig): string => {
  if (!border) return '';
  
  const classes: string[] = [];
  
  // Lado da borda
  if (border.side) {
    const sideMap = {
      all: 'border',
      top: 'border-t',
      right: 'border-r',
      bottom: 'border-b',
      left: 'border-l',
    };
    
    const borderBase = sideMap[border.side];
    
    // Largura
    if (border.width && border.width !== '0') {
      classes.push(`${borderBase}-${border.width}`);
    } else {
      classes.push(borderBase);
    }
  }
  
  // Cor da borda
  if (border.color) {
    classes.push(generateColorClass('border', border.color));
  }
  
  // Estilo da borda
  if (border.style && border.style !== 'solid') {
    classes.push(`border-${border.style}`);
  }
  
  // Raio da borda
  if (border.radius && border.radius !== 'none') {
    classes.push(`rounded-${border.radius}`);
  }
  
  return classes.join(' ');
};

/**
 * Gera classes de background
 */
const generateBackgroundClasses = (background?: BackgroundConfig): string => {
  if (!background) return '';
  
  const classes: string[] = [];
  
  // Cor de fundo simples
  if (background.color) {
    classes.push(generateColorClass('bg', background.color));
  }
  
  // Opacidade
  if (background.opacity && background.opacity !== '100') {
    classes.push(`bg-opacity-${background.opacity}`);
  }
  
  // Gradiente
  if (background.gradient) {
    const { type, from, to, via, direction } = background.gradient;
    
    if (type === 'linear') {
      classes.push(`bg-gradient-${direction || 'to-r'}`);
      classes.push(generateColorClass('from', from));
      classes.push(generateColorClass('to', to));
      if (via) classes.push(generateColorClass('via', via));
    }
  }
  
  return classes.join(' ');
};

/**
 * Gera classes de dimensões
 */
const generateDimensionsClasses = (dimensions?: StyleControls['dimensions']): string => {
  if (!dimensions) return '';
  
  const classes: string[] = [];
  
  if (dimensions.width) {
    if (['auto', 'full', 'screen', 'min', 'max', 'fit'].includes(dimensions.width)) {
      classes.push(`w-${dimensions.width}`);
    } else {
      classes.push(`w-[${dimensions.width}]`);
    }
  }
  
  if (dimensions.height) {
    if (['auto', 'full', 'screen', 'min', 'max', 'fit'].includes(dimensions.height)) {
      classes.push(`h-${dimensions.height}`);
    } else {
      classes.push(`h-[${dimensions.height}]`);
    }
  }
  
  if (dimensions.minWidth) classes.push(`min-w-[${dimensions.minWidth}]`);
  if (dimensions.maxWidth) classes.push(`max-w-${dimensions.maxWidth}`);
  if (dimensions.minHeight) classes.push(`min-h-[${dimensions.minHeight}]`);
  if (dimensions.maxHeight) classes.push(`max-h-${dimensions.maxHeight}`);
  
  return classes.join(' ');
};

/**
 * Gera classes de hover
 */
const generateHoverClasses = (hover?: StyleControls['hover']): string => {
  if (!hover) return '';
  
  const classes: string[] = [];
  
  if (hover.scale) classes.push('hover:scale-105 transition-transform');
  if (hover.shadow) classes.push('hover:shadow-xl transition-shadow');
  if (hover.opacity) classes.push('hover:opacity-80 transition-opacity');
  if (hover.brightness) classes.push('hover:brightness-110 transition-all');
  
  return classes.join(' ');
};

/**
 * Gera classes de animação
 */
const generateAnimationClasses = (animation?: StyleControls['animation']): string => {
  if (!animation || animation.type === 'none') return '';
  
  const classes: string[] = [];
  
  // Tipo de animação
  switch (animation.type) {
    case 'fade-in':
      classes.push('animate-fade-in');
      break;
    case 'slide-in':
      classes.push('animate-slide-in');
      break;
    case 'bounce':
      classes.push('animate-bounce');
      break;
    case 'pulse':
      classes.push('animate-pulse');
      break;
    case 'spin':
      classes.push('animate-spin');
      break;
  }
  
  // Duração
  if (animation.duration) {
    classes.push(`duration-${animation.duration}`);
  }
  
  // Delay
  if (animation.delay && animation.delay !== '0') {
    classes.push(`delay-${animation.delay}`);
  }
  
  return classes.join(' ');
};

/**
 * FUNÇÃO PRINCIPAL: Gera todas as classes Tailwind a partir de StyleControls
 */
export const generateStyleClasses = (styles?: StyleControls): string => {
  if (!styles) return '';
  
  const classes: string[] = [];
  
  // Espaçamento
  classes.push(generateSpacingClasses('m', styles.margin));
  classes.push(generateSpacingClasses('p', styles.padding));
  
  // Tipografia
  classes.push(generateTypographyClasses(styles.typography));
  
  // Cores
  if (styles.textColor) {
    classes.push(generateColorClass('text', styles.textColor));
  }
  
  // Background
  classes.push(generateBackgroundClasses(styles.background));
  
  // Bordas
  classes.push(generateBorderClasses(styles.border));
  
  // Dimensões
  classes.push(generateDimensionsClasses(styles.dimensions));
  
  // Sombra
  if (styles.shadow && styles.shadow !== 'none') {
    classes.push(`shadow-${styles.shadow}`);
  }
  
  // Opacidade
  if (styles.opacity && styles.opacity !== '100') {
    classes.push(`opacity-${styles.opacity}`);
  }
  
  // Hover
  classes.push(generateHoverClasses(styles.hover));
  
  // Animação
  classes.push(generateAnimationClasses(styles.animation));
  
  // Classes customizadas
  if (styles.customClasses) {
    classes.push(styles.customClasses);
  }
  
  // Remove strings vazias e junta tudo
  return classes.filter(Boolean).join(' ');
};

/**
 * Gera estilos inline para cores customizadas (hex)
 */
export const generateInlineStyles = (styles?: StyleControls): React.CSSProperties => {
  if (!styles) return {};
  
  const inlineStyles: React.CSSProperties = {};
  
  // Cor de texto customizada
  if (styles.textColor?.custom) {
    inlineStyles.color = styles.textColor.custom;
  }
  
  // Background customizado
  if (styles.background?.color?.custom) {
    inlineStyles.backgroundColor = styles.background.color.custom;
  }
  
  // Cor de borda customizada
  if (styles.border?.color?.custom) {
    inlineStyles.borderColor = styles.border.color.custom;
  }
  
  return inlineStyles;
};

/**
 * Hook helper para usar em componentes React
 */
export const useStyleClasses = (styles?: StyleControls) => {
  return {
    className: generateStyleClasses(styles),
    style: generateInlineStyles(styles),
  };
};