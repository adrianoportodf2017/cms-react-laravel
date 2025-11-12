/**
 * Configuração dos blocos disponíveis no Page Builder
 * Versão melhorada com controles de estilo avançados
 */

import type { ComponentConfig } from '@measured/puck';
 

/**
 * Configuração do bloco Hero - MELHORADO
 */
export const HeroBlockConfig: ComponentConfig = {
  fields: {
    // ===== CONTEÚDO =====
    title: {
      type: 'text',
      label: 'Título',
    },
    subtitle: {
      type: 'textarea',
      label: 'Subtítulo',
    },
    backgroundImage: {
      type: 'text',
      label: 'URL da Imagem de Fundo',
    },
    overlayOpacity: {
      type: 'select',
      label: 'Opacidade do Overlay',
      options: [
        { label: '0%', value: '0' },
        { label: '20%', value: '20' },
        { label: '40%', value: '40' },
        { label: '60%', value: '60' },
        { label: '80%', value: '80' },
      ],
    },
    ctaText: {
      type: 'text',
      label: 'Texto do Botão',
    },
    ctaLink: {
      type: 'text',
      label: 'Link do Botão',
    },
    alignment: {
      type: 'radio',
      label: 'Alinhamento',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
    },
    height: {
      type: 'select',
      label: 'Altura',
      options: [
        { label: 'Pequena (16rem)', value: 'small' },
        { label: 'Média (24rem)', value: 'medium' },
        { label: 'Grande (32rem)', value: 'large' },
        { label: 'Extra Grande (40rem)', value: 'xlarge' },
        { label: 'Tela Cheia', value: 'fullscreen' },
      ],
    },
    
    // ===== TIPOGRAFIA TÍTULO =====
    titleFontSize: {
      type: 'select',
      label: 'Tamanho do Título',
      options: [
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
        { label: '5XL', value: '5xl' },
        { label: '6XL', value: '6xl' },
        { label: '7XL', value: '7xl' },
        { label: '8XL', value: '8xl' },
        { label: '9XL', value: '9xl' },
      ],
    },
    titleFontWeight: {
      type: 'select',
      label: 'Peso do Título',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
        { label: 'Extrabold', value: 'extrabold' },
      ],
    },
    titleColor: {
      type: 'select',
      label: 'Cor do Título',
      options: [
        { label: 'Branco', value: 'white' },
        { label: 'Preto', value: 'black' },
        { label: 'Cinza Claro', value: 'gray-100' },
        { label: 'Cinza Escuro', value: 'gray-900' },
      ],
    },
    
    // ===== TIPOGRAFIA SUBTÍTULO =====
    subtitleFontSize: {
      type: 'select',
      label: 'Tamanho do Subtítulo',
      options: [
        { label: 'Base', value: 'base' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    subtitleColor: {
      type: 'select',
      label: 'Cor do Subtítulo',
      options: [
        { label: 'Branco', value: 'white' },
        { label: 'Branco/90%', value: 'white/90' },
        { label: 'Cinza Claro', value: 'gray-100' },
        { label: 'Cinza Médio', value: 'gray-300' },
      ],
    },
    
    // ===== BOTÃO =====
    buttonSize: {
      type: 'select',
      label: 'Tamanho do Botão',
      options: [
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
      ],
    },
    buttonColor: {
      type: 'select',
      label: 'Cor do Botão',
      options: [
        { label: 'Azul', value: 'blue' },
        { label: 'Verde', value: 'green' },
        { label: 'Vermelho', value: 'red' },
        { label: 'Roxo', value: 'purple' },
        { label: 'Amarelo', value: 'yellow' },
        { label: 'Branco', value: 'white' },
      ],
    },
    buttonRadius: {
      type: 'select',
      label: 'Arredondamento do Botão',
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: 'Full', value: 'full' },
      ],
    },
    
    // ===== ESPAÇAMENTO =====
    paddingTop: {
      type: 'select',
      label: 'Padding Superior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
        { label: '20', value: '20' },
        { label: '24', value: '24' },
      ],
    },
    paddingBottom: {
      type: 'select',
      label: 'Padding Inferior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
        { label: '20', value: '20' },
        { label: '24', value: '24' },
      ],
    },
  },
  defaultProps: {
    title: 'Título da Seção Hero',
    subtitle: 'Subtítulo descritivo',
    backgroundImage: '',
    overlayOpacity: '40',
    ctaText: 'Saiba Mais',
    ctaLink: '#',
    alignment: 'center',
    height: 'medium',
    titleFontSize: '5xl',
    titleFontWeight: 'bold',
    titleColor: 'white',
    subtitleFontSize: 'xl',
    subtitleColor: 'white/90',
    buttonSize: 'lg',
    buttonColor: 'blue',
    buttonRadius: 'lg',
    paddingTop: '0',
    paddingBottom: '0',
  },
  render: ({ 
    title, 
    subtitle, 
    backgroundImage, 
    overlayOpacity,
    ctaText, 
    ctaLink, 
    alignment, 
    height,
    titleFontSize,
    titleFontWeight,
    titleColor,
    subtitleFontSize,
    subtitleColor,
    buttonSize,
    buttonColor,
    buttonRadius,
    paddingTop,
    paddingBottom,
  }) => {
    const heightClasses = {
      small: 'h-64',
      medium: 'h-96',
      large: 'h-[32rem]',
      xlarge: 'h-[40rem]',
      fullscreen: 'h-screen',
    };

    const alignmentClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    };
    
    const buttonSizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };
    
    const buttonColors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
      white: 'bg-white hover:bg-gray-100 text-gray-900',
    };

    return (
      <section
        className={`relative flex flex-col justify-center ${heightClasses[height as keyof typeof heightClasses]} bg-cover bg-center pt-${paddingTop} pb-${paddingBottom}`}
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className={`absolute inset-0 bg-black/${overlayOpacity}`} />
        <div className={`relative z-10 container mx-auto px-4 flex flex-col ${alignmentClasses[alignment as keyof typeof alignmentClasses]}`}>
          <h1 className={`text-${titleFontSize} font-${titleFontWeight} text-${titleColor} mb-4 md:text-${titleFontSize === '5xl' ? '6xl' : '7xl'}`}>
            {title}
          </h1>
          <p className={`text-${subtitleFontSize} text-${subtitleColor} mb-8 max-w-2xl md:text-${subtitleFontSize === 'xl' ? '2xl' : '3xl'}`}>
            {subtitle}
          </p>
          {ctaText && (
            <a
              href={ctaLink}
              className={`inline-flex items-center ${buttonSizes[buttonSize as keyof typeof buttonSizes]} ${buttonColors[buttonColor as keyof typeof buttonColors]} font-semibold rounded-${buttonRadius} transition-colors`}
            >
              {ctaText}
            </a>
          )}
        </div>
      </section>
    );
  },
};

/**
 * Configuração do bloco Text - MELHORADO
 */
export const TextBlockConfig: ComponentConfig = {
  fields: {
    content: {
      type: 'textarea',
      label: 'Conteúdo',
    },
    
    // ===== TIPOGRAFIA =====
    fontSize: {
      type: 'select',
      label: 'Tamanho da Fonte',
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'SM', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    fontWeight: {
      type: 'select',
      label: 'Peso da Fonte',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
      ],
    },
    textColor: {
      type: 'select',
      label: 'Cor do Texto',
      options: [
        { label: 'Cinza Escuro', value: 'gray-900' },
        { label: 'Cinza Médio', value: 'gray-700' },
        { label: 'Cinza Claro', value: 'gray-500' },
        { label: 'Preto', value: 'black' },
        { label: 'Branco', value: 'white' },
        { label: 'Azul', value: 'blue-600' },
        { label: 'Verde', value: 'green-600' },
        { label: 'Vermelho', value: 'red-600' },
      ],
    },
    lineHeight: {
      type: 'select',
      label: 'Altura da Linha',
      options: [
        { label: 'Tight', value: 'tight' },
        { label: 'Snug', value: 'snug' },
        { label: 'Normal', value: 'normal' },
        { label: 'Relaxed', value: 'relaxed' },
        { label: 'Loose', value: 'loose' },
      ],
    },
    alignment: {
      type: 'radio',
      label: 'Alinhamento',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
        { label: 'Justificado', value: 'justify' },
      ],
    },
    
    // ===== LARGURA =====
    maxWidth: {
      type: 'select',
      label: 'Largura Máxima',
      options: [
        { label: 'Pequena', value: 'sm' },
        { label: 'Média', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '4XL', value: '4xl' },
        { label: 'Completa', value: 'full' },
      ],
    },
    
    // ===== ESPAÇAMENTO =====
    paddingTop: {
      type: 'select',
      label: 'Padding Superior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
      ],
    },
    paddingBottom: {
      type: 'select',
      label: 'Padding Inferior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
      ],
    },
    
    // ===== BACKGROUND =====
    backgroundColor: {
      type: 'select',
      label: 'Cor de Fundo',
      options: [
        { label: 'Transparente', value: 'transparent' },
        { label: 'Branco', value: 'white' },
        { label: 'Cinza Claro', value: 'gray-50' },
        { label: 'Cinza', value: 'gray-100' },
        { label: 'Azul Claro', value: 'blue-50' },
        { label: 'Verde Claro', value: 'green-50' },
      ],
    },
    
    // ===== BORDAS =====
    borderRadius: {
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
  },
  defaultProps: {
    content: 'Digite seu texto aqui...',
    fontSize: 'base',
    fontWeight: 'normal',
    textColor: 'gray-700',
    lineHeight: 'relaxed',
    alignment: 'left',
    maxWidth: 'full',
    paddingTop: '8',
    paddingBottom: '8',
    backgroundColor: 'transparent',
    borderRadius: 'none',
  },
  render: ({ 
    content, 
    fontSize, 
    fontWeight,
    textColor,
    lineHeight,
    alignment,
    maxWidth,
    paddingTop,
    paddingBottom,
    backgroundColor,
    borderRadius,
  }) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '4xl': 'max-w-4xl',
      full: 'max-w-full',
    };

    return (
      <div className="container mx-auto px-4">
        <div className={`${maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]} mx-auto py-${paddingTop} pb-${paddingBottom} bg-${backgroundColor} rounded-${borderRadius}`}>
          <p className={`text-${fontSize} font-${fontWeight} text-${textColor} leading-${lineHeight} text-${alignment} whitespace-pre-wrap`}>
            {content}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Configuração do bloco Image - MELHORADO
 */
export const ImageBlockConfig: ComponentConfig = {
  fields: {
    src: {
      type: 'text',
      label: 'URL da Imagem',
    },
    alt: {
      type: 'text',
      label: 'Texto Alternativo',
    },
    caption: {
      type: 'text',
      label: 'Legenda (opcional)',
    },
    
    // ===== DIMENSÕES =====
    width: {
      type: 'select',
      label: 'Largura',
      options: [
        { label: 'Pequena (320px)', value: 'small' },
        { label: 'Média (640px)', value: 'medium' },
        { label: 'Grande (1024px)', value: 'large' },
        { label: 'Extra Grande (1280px)', value: 'xlarge' },
        { label: 'Completa', value: 'full' },
      ],
    },
    height: {
      type: 'select',
      label: 'Altura',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '200px', value: '200' },
        { label: '300px', value: '300' },
        { label: '400px', value: '400' },
        { label: '500px', value: '500' },
        { label: '600px', value: '600' },
      ],
    },
    objectFit: {
      type: 'select',
      label: 'Ajuste da Imagem',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'Fill', value: 'fill' },
        { label: 'None', value: 'none' },
      ],
    },
    
    // ===== ALINHAMENTO =====
    alignment: {
      type: 'radio',
      label: 'Alinhamento',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
    },
    
    // ===== BORDAS =====
    rounded: {
      type: 'radio',
      label: 'Bordas Arredondadas',
      options: [
        { label: 'Não', value: 'none' },
        { label: 'Leve', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: 'Completo', value: 'full' },
      ],
    },
    borderWidth: {
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
    borderColor: {
      type: 'select',
      label: 'Cor da Borda',
      options: [
        { label: 'Cinza', value: 'gray-300' },
        { label: 'Azul', value: 'blue-500' },
        { label: 'Verde', value: 'green-500' },
        { label: 'Vermelho', value: 'red-500' },
      ],
    },
    
    // ===== EFEITOS =====
    shadow: {
      type: 'select',
      label: 'Sombra',
      options: [
        { label: 'Nenhuma', value: 'none' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
      ],
    },
    hoverEffect: {
      type: 'select',
      label: 'Efeito ao Passar o Mouse',
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Elevar', value: 'lift' },
        { label: 'Escurecer', value: 'darken' },
      ],
    },
    
    // ===== ESPAÇAMENTO =====
    paddingTop: {
      type: 'select',
      label: 'Padding Superior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
      ],
    },
    paddingBottom: {
      type: 'select',
      label: 'Padding Inferior',
      options: [
        { label: '0', value: '0' },
        { label: '4', value: '4' },
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
      ],
    },
  },
  defaultProps: {
    src: 'https://via.placeholder.com/800x400',
    alt: 'Imagem',
    caption: '',
    width: 'full',
    height: 'auto',
    objectFit: 'cover',
    alignment: 'center',
    rounded: 'md',
    borderWidth: '0',
    borderColor: 'gray-300',
    shadow: 'lg',
    hoverEffect: 'none',
    paddingTop: '8',
    paddingBottom: '8',
  },
  render: ({ 
    src, 
    alt, 
    caption, 
    width, 
    height,
    objectFit,
    alignment, 
    rounded,
    borderWidth,
    borderColor,
    shadow,
    hoverEffect,
    paddingTop,
    paddingBottom,
  }) => {
    const widthClasses = {
      small: 'max-w-xs',
      medium: 'max-w-2xl',
      large: 'max-w-4xl',
      xlarge: 'max-w-6xl',
      full: 'w-full',
    };

    const alignmentClasses = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto',
    };
    
    const hoverEffects = {
      none: '',
      zoom: 'hover:scale-105 transition-transform duration-300',
      lift: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300',
      darken: 'hover:brightness-75 transition-all duration-300',
    };
    
    const heightClass = height === 'auto' ? 'h-auto' : `h-[${height}px]`;

    return (
      <figure className={`container mx-auto px-4 py-${paddingTop} pb-${paddingBottom} ${widthClasses[width as keyof typeof widthClasses]} ${alignmentClasses[alignment as keyof typeof alignmentClasses]}`}>
        <div className="overflow-hidden">
          <img
            src={src}
            alt={alt}
            className={`w-full ${heightClass} object-${objectFit} rounded-${rounded} border-${borderWidth} border-${borderColor} shadow-${shadow} ${hoverEffects[hoverEffect as keyof typeof hoverEffects]}`}
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-gray-600 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};

// Manter os blocos CardGrid, CTA, Spacer e Divider como estavam
// (copiando do original para não perder)

export const CardGridBlockConfig: ComponentConfig = {
  fields: {
    title: {
      type: 'text',
      label: 'Título da Seção',
    },
    columns: {
      type: 'select',
      label: 'Número de Colunas',
      options: [
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
      ],
    },
    cards: {
      type: 'array',
      label: 'Cards',
      arrayFields: {
        title: { type: 'text', label: 'Título' },
        description: { type: 'textarea', label: 'Descrição' },
        image: { type: 'text', label: 'URL da Imagem' },
        link: { type: 'text', label: 'Link' },
      },
    },
  },
  defaultProps: {
    title: 'Nossos Serviços',
    columns: 3,
    cards: [
      {
        title: 'Card 1',
        description: 'Descrição do primeiro card',
        image: 'https://via.placeholder.com/400x300',
        link: '#',
      },
      {
        title: 'Card 2',
        description: 'Descrição do segundo card',
        image: 'https://via.placeholder.com/400x300',
        link: '#',
      },
      {
        title: 'Card 3',
        description: 'Descrição do terceiro card',
        image: 'https://via.placeholder.com/400x300',
        link: '#',
      },
    ],
  },
  render: ({ title, columns, cards }) => {
    const gridCols = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <section className="container mx-auto px-4 py-12">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
          {cards.map((card: any, index: number) => (
            <a
              key={index}
              href={card.link}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-600">
                  {card.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  },
};

export const CTABlockConfig: ComponentConfig = {
  fields: {
    title: {
      type: 'text',
      label: 'Título',
    },
    description: {
      type: 'textarea',
      label: 'Descrição',
    },
    buttonText: {
      type: 'text',
      label: 'Texto do Botão',
    },
    buttonLink: {
      type: 'text',
      label: 'Link do Botão',
    },
    backgroundColor: {
      type: 'select',
      label: 'Cor de Fundo',
      options: [
        { label: 'Azul', value: 'blue' },
        { label: 'Verde', value: 'green' },
        { label: 'Roxo', value: 'purple' },
        { label: 'Cinza', value: 'gray' },
      ],
    },
  },
  defaultProps: {
    title: 'Pronto para começar?',
    description: 'Entre em contato conosco e descubra como podemos ajudar.',
    buttonText: 'Fale Conosco',
    buttonLink: '#',
    backgroundColor: 'blue',
  },
  render: ({ title, description, buttonText, buttonLink, backgroundColor }) => {
    const bgColors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600',
      gray: 'bg-gray-800',
    };

    return (
      <section className={`${bgColors[backgroundColor as keyof typeof bgColors]} py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <a
            href={buttonLink}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </section>
    );
  },
};

export const SpacerBlockConfig: ComponentConfig = {
  fields: {
    height: {
      type: 'select',
      label: 'Altura',
      options: [
        { label: 'Pequeno (2rem)', value: 'sm' },
        { label: 'Médio (4rem)', value: 'md' },
        { label: 'Grande (6rem)', value: 'lg' },
        { label: 'Extra Grande (8rem)', value: 'xl' },
      ],
    },
  },
  defaultProps: {
    height: 'md',
  },
  render: ({ height }) => {
    const heights = {
      sm: 'h-8',
      md: 'h-16',
      lg: 'h-24',
      xl: 'h-32',
    };

    return <div className={heights[height as keyof typeof heights]} />;
  },
};

export const DividerBlockConfig: ComponentConfig = {
  fields: {
    style: {
      type: 'select',
      label: 'Estilo',
      options: [
        { label: 'Sólido', value: 'solid' },
        { label: 'Tracejado', value: 'dashed' },
        { label: 'Pontilhado', value: 'dotted' },
      ],
    },
    thickness: {
      type: 'select',
      label: 'Espessura',
      options: [
        { label: 'Fina', value: 'thin' },
        { label: 'Média', value: 'medium' },
        { label: 'Grossa', value: 'thick' },
      ],
    },
    color: {
      type: 'select',
      label: 'Cor',
      options: [
        { label: 'Cinza Claro', value: 'light' },
        { label: 'Cinza', value: 'gray' },
        { label: 'Cinza Escuro', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    style: 'solid',
    thickness: 'medium',
    color: 'gray',
  },
  render: ({ style, thickness, color }) => {
    const styles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    const thicknesses = {
      thin: 'border-t',
      medium: 'border-t-2',
      thick: 'border-t-4',
    };

    const colors = {
      light: 'border-gray-200',
      gray: 'border-gray-400',
      dark: 'border-gray-600',
    };

    return (
      <div className="container mx-auto px-4 py-4">
        <hr
          className={`${styles[style as keyof typeof styles]} ${thicknesses[thickness as keyof typeof thicknesses]} ${colors[color as keyof typeof colors]}`}
        />
      </div>
    );
  },
};