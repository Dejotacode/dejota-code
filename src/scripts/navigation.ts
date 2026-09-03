/**
 * Módulo de Navegação, Busca e Gestão de Foco no Cabeçalho
 */

export const NAV_CONFIG = {
  classIsOpen: "is-open",
  ariaExpanded: "aria-expanded",
  ariaHidden: "aria-hidden",
  ariaLabel: "aria-label",
  labels: {
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },
} as const;

export class NavigationManager {
  private navSearch: HTMLElement | null = null;
  private searchTrigger: HTMLButtonElement | null = null;
  private searchPanel: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private menuToggleButton: HTMLButtonElement | null = null;
  private mobileNav: HTMLElement | null = null;
  private desktopMenus: NodeListOf<HTMLDetailsElement> | null = null;

  constructor() {
    this.initElements();
    this.bindEvents();
  }

  private initElements(): void {
    this.navSearch = document.querySelector(".nav-search");
    this.searchTrigger =
      this.navSearch?.querySelector(".search-trigger") ?? null;
    this.searchPanel =
      this.navSearch?.querySelector(".nav-search-panel") ?? null;
    this.searchInput =
      this.navSearch?.querySelector<HTMLInputElement>("input") ?? null;
    this.menuToggleButton = document.getElementById(
      "menu-toggle",
    ) as HTMLButtonElement | null;
    this.mobileNav = document.getElementById("mobile-nav");
    this.desktopMenus =
      document.querySelectorAll<HTMLDetailsElement>(".nav > .nav-menu");
  }

  private bindEvents(): void {
    // Alternar busca desktop
    this.searchTrigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleSearchPanel();
    });

    // Fechar e limpar busca
    document.querySelectorAll(".search-close").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const mobileInput = (
          button.closest("form") as HTMLFormElement
        )?.querySelector<HTMLInputElement>("input");
        if (mobileInput) {
          mobileInput.value = "";
          mobileInput.focus();
        }
        this.closeSearchPanel(true);
      });
    });

    // Alternar menu mobile
    this.menuToggleButton?.addEventListener("click", () => {
      this.toggleMobileNav();
    });

    // Mantém apenas um submenu desktop aberto por vez.
    this.desktopMenus?.forEach((menu) => {
      menu.addEventListener("toggle", () => {
        if (!menu.open) return;
        this.desktopMenus?.forEach((otherMenu) => {
          if (otherMenu !== menu) otherMenu.open = false;
        });
      });
    });

    // Fechar ao clicar em links
    document.querySelectorAll(".site-header a").forEach((link) => {
      link.addEventListener("click", () => {
        this.closeSearchPanel(false);
        this.closeMobileNav();
      });
    });

    // Eventos globais de teclado (Esc) e clique fora
    document.addEventListener("click", (e) => {
      if (
        this.navSearch &&
        e.target instanceof Node &&
        !this.navSearch.contains(e.target)
      ) {
        this.closeSearchPanel(false);
      }
      if (
        e.target instanceof Node &&
        !Array.from(this.desktopMenus ?? []).some((menu) =>
          menu.contains(e.target as Node),
        )
      ) {
        this.closeDesktopMenus();
      }
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.closeSearchPanel(true);
        this.closeMobileNav();
        this.closeDesktopMenus();
      }
    });
  }

  public closeDesktopMenus(): void {
    this.desktopMenus?.forEach((menu) => {
      menu.open = false;
    });
  }

  public toggleSearchPanel(): void {
    if (!this.navSearch) return;
    const isOpen = this.navSearch.classList.contains(NAV_CONFIG.classIsOpen);
    const nextState = !isOpen;

    this.navSearch.classList.toggle(NAV_CONFIG.classIsOpen, nextState);
    this.searchTrigger?.setAttribute(
      NAV_CONFIG.ariaExpanded,
      String(nextState),
    );
    this.searchPanel?.setAttribute(NAV_CONFIG.ariaHidden, String(!nextState));

    if (nextState && this.searchInput) {
      this.searchInput.focus();
    }
  }

  public closeSearchPanel(clearInput = true): void {
    if (!this.navSearch) return;
    this.navSearch.classList.remove(NAV_CONFIG.classIsOpen);
    this.searchTrigger?.setAttribute(NAV_CONFIG.ariaExpanded, "false");
    this.searchPanel?.setAttribute(NAV_CONFIG.ariaHidden, "true");

    if (clearInput) {
      document
        .querySelectorAll<HTMLInputElement>(
          ".nav-search input, .mobile-search input",
        )
        .forEach((input) => {
          input.value = "";
        });
    }
  }

  public toggleMobileNav(): void {
    if (!this.menuToggleButton || !this.mobileNav) return;
    const isHidden = this.mobileNav.hidden;
    const nextHidden = !isHidden;

    this.mobileNav.hidden = nextHidden;
    this.menuToggleButton.setAttribute(
      NAV_CONFIG.ariaExpanded,
      String(!nextHidden),
    );
    this.menuToggleButton.setAttribute(
      NAV_CONFIG.ariaLabel,
      nextHidden ? NAV_CONFIG.labels.openMenu : NAV_CONFIG.labels.closeMenu,
    );
  }

  public closeMobileNav(): void {
    if (this.mobileNav && !this.mobileNav.hidden) {
      this.mobileNav.hidden = true;
      this.menuToggleButton?.setAttribute(NAV_CONFIG.ariaExpanded, "false");
      this.menuToggleButton?.setAttribute(
        NAV_CONFIG.ariaLabel,
        NAV_CONFIG.labels.openMenu,
      );
    }
  }
}

// Auto-inicializar
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    new NavigationManager();
  });
}
