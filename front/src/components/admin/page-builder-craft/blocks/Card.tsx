// src/pageBuilder/extensions/Card.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import type { CardProps } from '../types/blocks';

export const Card: React.FC<CardProps> & { craft?: any } = ({
  title = 'Título do Card',
  content = 'Conteúdo do card aqui...',
  background = '#ffffff',
  shadow = '0 4px 6px rgba(0,0,0,0.1)',
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
        padding: '30px',
        borderRadius: '8px',
        boxShadow: shadow,
        border: selected ? '2px solid #2563eb' : '2px dashed #ccc',
        cursor: 'move',
        minHeight: '200px',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0' }}>{title}</h3>
      <p style={{ margin: 0 }}>{content}</p>
    </div>
  );
};

Card.craft = {
  displayName: 'Card',
  props: {
    title: 'Título do Card',
    content: 'Conteúdo do card aqui...',
    background: '#ffffff',
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};
