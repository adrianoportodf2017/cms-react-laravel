// src/pageBuilder/extensions/Hero.tsx
import React from 'react';
import { useNode, Element } from '@craftjs/core';
import type { HeroProps } from '../types/blocks';
import { Button } from './Button';

export const Hero: React.FC<HeroProps> & { craft?: any } = ({
  title = 'Título Hero',
  subtitle = 'Subtítulo da seção hero',
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textColor = '#ffffff',
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        background,
        color: textColor,
        padding: '80px 20px',
        textAlign: 'center',
        border: selected ? '2px solid #2563eb' : '2px dashed #ccc',
        cursor: 'move',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', margin: '0 0 30px 0' }}>{subtitle}</p>
      <Element is={Button} canvas>
        <Button text="Começar Agora" />
      </Element>
    </div>
  );
};

Hero.craft = {
  displayName: 'Hero Section',
  props: {
    title: 'Título Hero',
    subtitle: 'Subtítulo da seção hero',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
  },
};
