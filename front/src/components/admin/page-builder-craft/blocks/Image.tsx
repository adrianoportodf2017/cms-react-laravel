// src/pageBuilder/extensions/Image.tsx
import React from 'react';
import { useNode } from '@craftjs/core';
import { Resizable } from 're-resizable';
import { RESIZABLE_HANDLES } from '../utils/resizable';
import { snapToGrid } from '../utils/grid';
import type { ImageProps } from '../types/blocks';

export const Image: React.FC<ImageProps> & { craft?: any } = ({
  src = 'https://via.placeholder.com/400x300',
  alt = 'Imagem',
  width = 400,
  height = 300,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProp((props: any) => {
          props.src = event.target?.result as string;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Resizable
      size={{ width, height }}
      onResizeStop={(e, direction, ref) => {
        const rawWidth = parseInt(ref.style.width);
        const rawHeight = parseInt(ref.style.height);

        setProp((props: any) => {
          if (!Number.isNaN(rawWidth)) {
            props.width = snapToGrid(rawWidth);
          }
          if (!Number.isNaN(rawHeight)) {
            props.height = snapToGrid(rawHeight);
          }
        });
      }}
      enable={selected ? RESIZABLE_HANDLES : {}}
      lockAspectRatio
    >
      <div
        ref={(ref: any) => ref && connect(drag(ref))}
        style={{
          padding: '10px',
          background: 'white',
          border: selected ? '2px solid #2563eb' : '1px solid #ddd',
          cursor: 'move',
          position: 'relative',
          height: '100%',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />

        {selected && (
          <label
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#2563eb',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 10,
            }}
          >
            📷 Trocar
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>
    </Resizable>
  );
};

Image.craft = {
  displayName: 'Image',
  props: {
    src: 'https://via.placeholder.com/400x300',
    alt: 'Imagem',
    width: 400,
    height: 300,
  },
  rules: {
    canDrag: () => true,
  },
};
