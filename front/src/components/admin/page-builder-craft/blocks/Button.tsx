// src/pageBuilder/extensions/Button.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 're-resizable';
import { RESIZABLE_HANDLES } from '../utils/resizable';
import type { ButtonProps } from '../types/blocks';

export const Button: React.FC<ButtonProps> & { craft?: any } = ({
  text = 'Clique aqui',
  background = '#2563eb',
  color = 'white',
  padding = '10px 20px',
  borderRadius = 6,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <Resizable
      size={{ width: 'auto', height: 'auto' }}
      enable={selected ? RESIZABLE_HANDLES : {}}
    >
      <button
        ref={(ref: any) => ref && connect(drag(ref))}
        style={{
          background,
          color,
          padding,
          border: selected ? '2px solid #2563eb' : '2px solid transparent',
          borderRadius: `${borderRadius}px`,
          cursor: 'pointer',
        }}
      >
        {text}
      </button>
    </Resizable>
  );
};

Button.craft = {
  displayName: 'Botão',
  props: {
    text: 'Clique aqui',
    background: '#2563eb',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 6,
  },
};
