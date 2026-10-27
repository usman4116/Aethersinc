export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (element === null) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerHeight = document.querySelector('header')?.offsetHeight ?? 48;
  const top = typeof element === 'number' ? element : element.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({ top, behavior: immediate || reduced ? 'instant' : 'smooth' });
}
