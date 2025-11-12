/**
 * Types para controles de estilo dos componentes (estilo Elementor)
 */

/**
 * Valores de espaçamento (margin e padding)
 */
export type SpacingValue = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';

/**
 * Configuração de espaçamento (margin ou padding)
 */
export interface SpacingConfig {
  top?: SpacingValue;
  right?: SpacingValue;
  bottom?: SpacingValue;
  left?: SpacingValue;
}

/**
 * Tamanhos de fonte
 */
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';

/**
 * Pesos de fonte
 */
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

/**
 * Alinhamento de texto
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Estilos de texto
 */
export interface TextStyle {
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
}

/**
 * Configuração de tipografia
 */
export interface TypographyConfig {
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  textStyle?: TextStyle;
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
}

/**
 * Cores pré-definidas (paleta Tailwind)
 */
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

export type ColorName = 
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
  | 'white' | 'black' | 'transparent';

/**
 * Configuração de cor completa
 */
export interface ColorConfig {
  name: ColorName;
  shade?: ColorShade;
  custom?: string; // Para cores hexadecimais customizadas
}

/**
 * Lados da borda
 */
export type BorderSide = 'all' | 'top' | 'right' | 'bottom' | 'left';

/**
 * Largura da borda
 */
export type BorderWidth = '0' | '1' | '2' | '4' | '8';

/**
 * Raio da borda
 */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

/**
 * Configuração de borda
 */
export interface BorderConfig {
  side?: BorderSide;
  width?: BorderWidth;
  color?: ColorConfig;
  radius?: BorderRadius;
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
}

/**
 * Configuração de sombra
 */
export type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

/**
 * Configuração de opacidade
 */
export type Opacity = '0' | '5' | '10' | '20' | '25' | '30' | '40' | '50' | '60' | '70' | '75' | '80' | '90' | '95' | '100';

/**
 * Configuração de background
 */
export interface BackgroundConfig {
  color?: ColorConfig;
  opacity?: Opacity;
  gradient?: {
    type: 'linear' | 'radial';
    from: ColorConfig;
    to: ColorConfig;
    via?: ColorConfig;
    direction?: 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl';
  };
}

/**
 * Configuração de largura
 */
export type WidthValue = 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | string;

/**
 * Configuração de altura
 */
export type HeightValue = 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | string;

/**
 * Configuração de dimensões
 */
export interface DimensionsConfig {
  width?: WidthValue;
  height?: HeightValue;
  minWidth?: WidthValue;
  maxWidth?: WidthValue;
  minHeight?: HeightValue;
  maxHeight?: HeightValue;
}

/**
 * Efeitos de hover
 */
export interface HoverEffects {
  scale?: boolean;
  shadow?: boolean;
  opacity?: boolean;
  brightness?: boolean;
}

/**
 * Animações
 */
export type AnimationType = 'none' | 'fade-in' | 'slide-in' | 'bounce' | 'pulse' | 'spin';

export interface AnimationConfig {
  type?: AnimationType;
  duration?: '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000';
  delay?: '0' | '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000';
}

/**
 * INTERFACE PRINCIPAL: Controles de estilo completos
 * Todos os componentes devem herdar dessa interface
 */
export interface StyleControls {
  // Espaçamento
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  
  // Tipografia
  typography?: TypographyConfig;
  
  // Cores
  textColor?: ColorConfig;
  background?: BackgroundConfig;
  
  // Bordas
  border?: BorderConfig;
  
  // Dimensões
  dimensions?: DimensionsConfig;
  
  // Efeitos visuais
  shadow?: ShadowSize;
  opacity?: Opacity;
  
  // Interatividade
  hover?: HoverEffects;
  
  // Animações
  animation?: AnimationConfig;
  
  // Classes customizadas (para casos específicos)
  customClasses?: string;
}

/**
 * Helper type: Props de componente com controles de estilo
 */
export interface ComponentWithStyles {
  id: string;
  styles?: StyleControls;
}