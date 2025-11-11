// Types básicos do Puck
export interface PuckData {
  content: any[];
  root: {
    props?: Record<string, any>;
  };
}

// Types para componentes básicos
export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface TextSectionProps {
  title?: string;
  content?: string;
  align?: 'left' | 'center' | 'right';
}

export interface CardItem {
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

export interface CardGridProps {
  cards?: CardItem[];
}

export interface ImageSectionProps {
  imageUrl?: string;
  alt?: string;
  caption?: string;
  position?: 'left' | 'center' | 'right';
}

export interface TwoColumnSectionProps {
  leftContent?: string;
  rightContent?: string;
  leftTitle?: string;
  rightTitle?: string;
}

export interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: 'blue' | 'green' | 'purple' | 'red';
}

// Types para sistema de colunas
export interface ColumnProps {
  children?: any[];
}

export interface TwoColumnsProps {
  col1?: any[];
  col2?: any[];
}

export interface ThreeColumnsProps {
  col1?: any[];
  col2?: any[];
  col3?: any[];
}

export interface FourColumnsProps {
  col1?: any[];
  col2?: any[];
  col3?: any[];
  col4?: any[];
}

// Types para editor HTML
export interface HtmlSectionProps {
  htmlContent?: string;
  cssContent?: string;
  editorHeight?: number;
}

// Types para modal de código
export interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onChange: (code: string) => void;
  language?: 'html' | 'css' | 'javascript' | 'json';
  title?: string;
}

// Types para botão de ação customizado
export interface CustomActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}