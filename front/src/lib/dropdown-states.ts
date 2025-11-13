/**
 * Estado global para Dropdowns
 * Resolve problema de useState não funcionar dentro do Puck Editor
 * 
 * @file src/lib/dropdown-state.ts
 */

import { create } from 'zustand';

interface DropdownState {
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (id: string) => void;
  setDropdownOpen: (id: string, isOpen: boolean) => void;
  initializeDropdown: (id: string, defaultOpen: boolean) => void;
}

export const useDropdownState = create<DropdownState>((set) => ({
  openDropdowns: {},
  
  toggleDropdown: (id) =>
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [id]: !state.openDropdowns[id],
      },
    })),
  
  setDropdownOpen: (id, isOpen) =>
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [id]: isOpen,
      },
    })),
  
  initializeDropdown: (id, defaultOpen) =>
    set((state) => {
      if (state.openDropdowns[id] === undefined) {
        return {
          openDropdowns: {
            ...state.openDropdowns,
            [id]: defaultOpen,
          },
        };
      }
      return state;
    }),
}));