import { useCallback, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Globe2, X } from 'lucide-react';
import gsap from 'gsap';
import type { ClientProject } from '../data/projects';

export interface WorkPreviewSelection {
  project: ClientProject;
  source: HTMLButtonElement;
  bounds: DOMRect;
  mode: 'hover' | 'click';
}

export function WorkPreview({ selection, onDismiss }: { selection: WorkPreviewSelection; onDismiss: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const closingRef = useRef(false);
  const exitRef = useRef<gsap.core.Timeline>();
  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { onDismiss(); return; }
    exitRef.current = gsap.timeline({ onComplete: onDismiss })
      .to(panelRef.current, { opacity: 0, scale: .975, y: 14, duration: .22, ease: 'power2.in' }, 0)
      .to(overlayRef.current, { opacity: 0, duration: .25 }, 0);
  }, [onDismiss]);

  useLayoutEffect(() => {
    const panel = panelRef.current!;
    const overlay = overlayRef.current!;
    const background = document.getElementById('root');
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousInert = background?.inert ?? false;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
    document.body.style.overflow = 'hidden';
    if (background) background.inert = true;
    if (selection.mode === 'hover') panel.focus({ preventScroll: true });
    else panel.querySelector<HTMLButtonElement>('.work-preview-close')?.focus({ preventScroll: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bounds = panel.getBoundingClientRect();
    const source = selection.bounds;
    const context = gsap.context(() => {
      if (reduced) { readyRef.current = true; return; }
      gsap.from(overlay.querySelector('.work-preview-backdrop'), { opacity: 0, duration: .45, ease: 'power2.out' });
      gsap.fromTo(panel, {
        x: source.x + source.width / 2 - bounds.x - bounds.width / 2,
        y: source.y + source.height / 2 - bounds.y - bounds.height / 2,
        scale: Math.max(.35, Math.min(.8, source.width / bounds.width)),
        opacity: .2,
      }, { x: 0, y: 0, scale: 1, opacity: 1, duration: .55, ease: 'power3.out', onComplete: () => { readyRef.current = true; } });
    }, overlay);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const items = [...panel.querySelectorAll<HTMLElement>('a[href], button')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      context.revert(); exitRef.current?.kill();
      readyRef.current = false;
      document.removeEventListener('keydown', key);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (background) background.inert = previousInert;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [selection, close]);

  const { project } = selection;
  return createPortal(<div className="work-preview-overlay" ref={overlayRef}
    onPointerMove={event => {
      if (selection.mode !== 'hover' || event.pointerType !== 'mouse' || !readyRef.current) return;
      const panel = panelRef.current!.getBoundingClientRect();
      if (event.clientX < panel.left || event.clientX > panel.right || event.clientY < panel.top || event.clientY > panel.bottom) close();
    }}
    onPointerLeave={event => { if (selection.mode === 'hover' && !event.relatedTarget && readyRef.current) close(); }}
    onPointerDown={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="work-preview-backdrop" />
    <div ref={panelRef} className="work-preview-panel" role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby="work-preview-title">
      <div className="work-preview-toolbar">
        <span className="work-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="work-preview-address"><Globe2 size={13} />{new URL(project.url).hostname}</span>
        <button className="work-preview-close" type="button" onClick={close} aria-label="Close website preview"><X size={18} /></button>
      </div>
      <a className="work-preview-screen" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} live website, opens in a new tab`}>
        <img src={project.image} alt={`${project.name} website, enlarged preview`} width="1280" height="800" />
        <span className="work-preview-visit">Visit live website<ArrowUpRight size={18} /></span>
      </a>
      <div className="work-preview-caption"><div><span className="mono">{project.category}</span><h3 id="work-preview-title">{project.name}</h3></div><span className="work-preview-note">Designed to be experienced.<ArrowUpRight size={20} /></span></div>
    </div>
  </div>, document.body);
}
