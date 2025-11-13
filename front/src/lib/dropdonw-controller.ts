/**
 * Controlador de Dropdowns/Accordions
 * Sistema baseado em data-attributes que funciona em qualquer contexto
 * 
 * @file src/lib/dropdown-controller.ts
 */

/**
 * Inicializa o controlador de dropdowns
 * Adiciona event listeners para todos os dropdowns da página
 */
export function initDropdownController() {
  // Delega o evento de click no documento inteiro
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Procura pelo botão de dropdown (pode ser o elemento clicado ou um pai)
    const button = target.closest('[data-dropdown-trigger]');
    
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdownId = button.getAttribute('data-dropdown-trigger');
      if (dropdownId) {
        toggleDropdown(dropdownId);
      }
    }
  });
}

/**
 * Abre/fecha um dropdown específico
 */
function toggleDropdown(dropdownId: string) {
  const content = document.querySelector(`[data-dropdown-content="${dropdownId}"]`);
  const icon = document.querySelector(`[data-dropdown-icon="${dropdownId}"]`);
  
  if (!content) return;
  
  const isOpen = content.getAttribute('data-dropdown-open') === 'true';
  
  if (isOpen) {
    // Fechar
    content.setAttribute('data-dropdown-open', 'false');
    if (icon) {
      icon.classList.remove('dropdown-icon-open');
    }
  } else {
    // Abrir
    content.setAttribute('data-dropdown-open', 'true');
    if (icon) {
      icon.classList.add('dropdown-icon-open');
    }
  }
}

/**
 * Inicializa dropdowns que devem começar abertos
 */
export function initDefaultOpenDropdowns() {
  const defaultOpenDropdowns = document.querySelectorAll('[data-dropdown-default-open="true"]');
  
  defaultOpenDropdowns.forEach((element) => {
    const dropdownId = element.getAttribute('data-dropdown-content');
    if (dropdownId) {
      const icon = document.querySelector(`[data-dropdown-icon="${dropdownId}"]`);
      element.setAttribute('data-dropdown-open', 'true');
      if (icon) {
        icon.classList.add('dropdown-icon-open');
      }
    }
  });
}

// Auto-inicializa quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDropdownController();
      initDefaultOpenDropdowns();
    });
  } else {
    initDropdownController();
    initDefaultOpenDropdowns();
  }
}