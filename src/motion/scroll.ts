import type Lenis from 'lenis';

let controller: Lenis | null = null;

export function setScrollController(value: Lenis | null) {
  controller = value;
}

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (element === null) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (controller) {
    controller.scrollTo(element, { offset: typeof element === 'number' ? 0 : -96, immediate: immediate || reduced, duration: 1.15, force: true });
    return;
  }
  const top = typeof element === 'number' ? element : element.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: immediate || reduced ? 'instant' : 'smooth' });
}
