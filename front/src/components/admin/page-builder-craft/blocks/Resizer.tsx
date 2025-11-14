// src/pageBuilder/blocks/Resizer.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 're-resizable';
import {
  RESIZABLE_HANDLES,
  RESIZE_HANDLE_STYLES,
  snapCssSize,
} from '../utils/resizable';

type ResizerProps = {
  // quais props o resizer controla como width/height
  propKey: {
    width: string;
    height: string;
  };
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const Resizer: React.FC<ResizerProps> = ({ propKey, style, children }) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
    props,
  } = useNode((node) => ({
    selected: node.events.selected,
    props: node.data.props as any,
  }));

  const widthProp = props[propKey.width] ?? 'auto';
  const heightProp = props[propKey.height] ?? 'auto';

  // estilo com highlight quando selecionado
  const contentStyle: React.CSSProperties = {
    ...style,
    border: selected ? '1px dashed #2563eb' : '1px dashed transparent',
    boxShadow: selected ? '0 0 0 1px rgba(37,99,235,0.3)' : 'none',
    transition: 'border 0.1s ease, box-shadow 0.1s ease',
  };

  return (
    // ESTE wrapper é o "node raiz" do Craft
    <div
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <Resizable
        size={{ width: widthProp, height: heightProp }}
        enable={selected ? RESIZABLE_HANDLES : {}}
        handleStyles={selected ? RESIZE_HANDLE_STYLES : {}}
        onResizeStop={(e, direction, ref) => {
          const rawWidth = ref.style.width;
          const rawHeight = ref.style.height;

          setProp((props: any) => {
            props[propKey.width] = snapCssSize(rawWidth);
            props[propKey.height] = snapCssSize(rawHeight);
          });
        }}
      >
        <div style={contentStyle}>{children}</div>
      </Resizable>
    </div>
  );
};
