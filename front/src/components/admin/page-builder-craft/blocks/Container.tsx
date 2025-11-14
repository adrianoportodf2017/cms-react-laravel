// src/pageBuilder/blocks/Container.tsx
import React from 'react';
import { Resizer } from './Resizer';

export interface ContainerProps {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  background?: string;
  padding?: number;
}

const defaultProps: Required<Omit<ContainerProps, 'children'>> = {
  width: '100%',
  height: 'auto',
  background: '#f9fafb',
  padding: 20,
};

export const Container: React.FC<Partial<ContainerProps>> & { craft?: any } = (
  props,
) => {
  const { width, height, background, padding, children } = {
    ...defaultProps,
    ...props,
  };

  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={{
        background,
        minHeight: '80px',
        position: 'relative',
        display: 'block',
        cursor: 'move',
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      {children || (
        <span style={{ color: '#9ca3af', fontSize: 12 }}>
          Arraste componentes aqui
        </span>
      )}
    </Resizer>
  );
};

Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};
