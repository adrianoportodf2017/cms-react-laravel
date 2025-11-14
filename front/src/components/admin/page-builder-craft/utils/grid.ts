// src/pageBuilder/utils/grid.ts

// Tamanho da grade em pixels (8 ou 10 são bem comuns)
export const GRID_SIZE = 8;

/**
 * Arredonda um número para o múltiplo mais próximo do GRID_SIZE.
 */
export const snapToGrid = (value: number, grid = GRID_SIZE): number => {
  return Math.round(value / grid) * grid;
};

/**
 * Recebe um valor CSS (ex: "347px", "auto", "50%") e:
 * - Se for px: arredonda para a grade (grid)
 * - Se for outro tipo (%, auto etc): devolve como está
 */
export const snapCssSize = (
  cssValue: string | number,
  grid = GRID_SIZE
): string | number => {
  if (typeof cssValue === 'number') {
    return snapToGrid(cssValue, grid);
  }

  const value = cssValue.trim();

  // Não fazemos snap em %, auto, etc.
  if (value === 'auto' || value.endsWith('%') || value === '') {
    return value;
  }

  // Tenta ler como número em px
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) {
    return value;
  }

  const snapped = snapToGrid(numeric, grid);
  return `${snapped}px`;
};
