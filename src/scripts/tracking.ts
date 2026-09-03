/**
 * Telemetria, Eventos de Analytics e Otimizações Globais
 */

export interface TrackPayload {
  event: string;
  label?: string;
  href?: string;
  path?: string;
  ts?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    dejotacodeTrack?: (eventName: string, detail?: Record<string, unknown>) => void;
  }
}

export function trackEvent(eventName: string, detail: Record<string, unknown> = {}): void {
  const payload: TrackPayload = {
    event: eventName,
    ...detail,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
    ts: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload as Record<string, unknown>);
    window.dispatchEvent(new CustomEvent('dejotacode:track', { detail: payload }));
  }
}

export function initGlobalTracking(): void {
  window.dejotacodeTrack = trackEvent;

  // Delegar cliques em elementos data-event
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest('[data-event]');
    if (!target) return;

    const eventName = target.getAttribute('data-event') || 'cta_click';
    const label = target.textContent?.trim();
    const href = target.getAttribute('href') || undefined;

    trackEvent(eventName, { label, href });
  });

  // Notificar visualização de newsletters segmentadas
  document.querySelectorAll('[data-newsletter-segment]').forEach((box) => {
    const segment = box.getAttribute('data-newsletter-segment') || 'geral';
    trackEvent('newsletter_start', { segment });
  });
}

export function optimizeImages(): void {
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    optimizeImages();
    initGlobalTracking();
  });
}
