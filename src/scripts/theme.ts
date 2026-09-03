/**
 * Gerenciador de Tema (Dark / Light Mode)
 * Módulo client-side performático e encapsulado.
 */

export const THEME_CONFIG = {
  storageKey: 'dejotacode-theme',
  themeDark: 'dark',
  themeLight: 'light'
} as const;

export function initTheme(): void {
  const rootElement = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey);
  if (savedTheme) {
    rootElement.dataset.theme = savedTheme;
  }
}

export function toggleTheme(): void {
  const rootElement = document.documentElement;
  const currentTheme = rootElement.dataset.theme;
  const nextTheme = currentTheme === THEME_CONFIG.themeDark ? THEME_CONFIG.themeLight : THEME_CONFIG.themeDark;
  rootElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_CONFIG.storageKey, nextTheme);
}

// Auto-inicialização caso o elemento exista no DOM
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const themeToggleButton = document.getElementById('theme-toggle');
  themeToggleButton?.addEventListener('click', toggleTheme);
});
