// src/pageBuilder/utils/resizable.ts
import React from 'react';

export const GRID_SIZE = 8;

export const snapToGrid = (value: number, grid = GRID_SIZE): number => {
  return Math.round(value / grid) * grid;
};

export const snapCssSize = (
  cssValue: string | number,
  grid = GRID_SIZE
): string | number => {
  if (typeof cssValue === 'number') {
    return `${snapToGrid(cssValue, grid)}px`;
  }

  const value = cssValue.trim();

  if (value === 'auto' || value.endsWith('%') || value === '') {
    return value;
  }

  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) {
    return value;
  }

  const snapped = snapToGrid(numeric, grid);
  return `${snapped}px`;
};

// Handles padrão do re-resizable
export const RESIZABLE_HANDLES = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
};

// Estilo base da “bolinha”
const HANDLE_CIRCLE: React.CSSProperties = {
  width: '10px',
  height: '10px',
  borderRadius: '9999px',
  background: '#2563eb',
  border: '2px solid #ffffff',
  boxShadow: '0 0 0 1px rgba(37,99,235,0.4)',
};

export const RESIZE_HANDLE_STYLES: any = {
  topLeft: HANDLE_CIRCLE,
  topRight: HANDLE_CIRCLE,
  bottomLeft: HANDLE_CIRCLE,
  bottomRight: HANDLE_CIRCLE,
};
