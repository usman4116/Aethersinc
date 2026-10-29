import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { featuredClientProjects } from '../data/projects';
import type { ClientProject } from '../data/projects';
import { Eyebrow, TextLink } from './UI';
import { WorkPreview, type WorkPreviewSelection } from './WorkPreview';

export function HorizontalWork() {
  const ref = useRef<HTMLElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const playbackRef = useRef(() => {});
  const dismissedRef = useRef<{ source: HTMLButtonElement; until: number } | null>(null);
  const [selection, setSelection] = useState<WorkPreviewSelection | null>(null);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const holdRef = useRef(false);

  useLayoutEffect(() => {
    holdRef.current = paused || focused || selection !== null;
    playbackRef.current();
  }, [paused, focused, selection]);

  useLayoutEffect(() => {
    const root = ref.current!;
    const track = root.querySelector<HTMLElement>('.work-track')!;
    const group = root.querySelector<HTMLElement>('.work-loop-group')!;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(root.querySelector('.work-viewport'), { clipPath: 'inset(0 5% 0 5%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: root, start: 'top 95%', end: 'top 15%', scrub: .6 } });
      let inView = false;
      let resizeFrame = 0;
      root.classList.add('work-is-looping');
      const sync = () => {
        const running = inView && !holdRef.current && !document.hidden;
        tweenRef.current?.paused(!running);
        root.dataset.running = String(running);
      };
      playbackRef.current = sync;
      const rebuild = () => {
        const progress = tweenRef.current?.progress() ?? 0;
        tweenRef.current?.kill();
        const distance = group.offsetWidth;
        tweenRef.current = gsap.fromTo(track, { x: 0 }, { x: -distance, duration: distance / 42, repeat: -1, ease: 'none', paused: true });
        tweenRef.current.progress(progress);
        sync();
      };
      rebuild();
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(rebuild);
      });
      resize.observe(group);
      const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
      visibility.observe(root);
      document.addEventListener('visibilitychange', sync);
      return () => {
        cancelAnimationFrame(resizeFrame); resize.disconnect(); visibility.disconnect();
        document.removeEventListener('visibilitychange', sync);
        tweenRef.current?.kill(); tweenRef.current = null;
        gsap.set(track, { clearProps: 'transform' });
        root.classList.remove('work-is-looping'); delete root.dataset.running;
        playbackRef.current = () => {};
      };
    });
    const clearDismissed = (event: PointerEvent) => {
      const dismissed = dismissedRef.current;
      if (!dismissed) return;
      const bounds = dismissed.source.getBoundingClientRect();
      if (performance.now() > dismissed.until && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dismissedRef.current = null;
    };
    window.addEventListener('pointermove', clearDismissed, { passive: true });
    return () => { media.revert(); window.removeEventListener('pointermove', clearDismissed); };
  }, []);

  const openPreview = (project: ClientProject, source: HTMLButtonElement, mode: 'hover' | 'click') => {
    if (selection) return;
    const dismissed = dismissedRef.current;
    if (mode === 'hover' && dismissed && (dismissed.source === source || performance.now() < dismissed.until)) return;
    setSelection({ project, source, mode, bounds: source.getBoundingClientRect() });
  };
  const dismiss = useCallback(() => {
    setSelection(current => {
      if (current) dismissedRef.current = { source: current.source, until: performance.now() + 450 };
      return null;
    });
  }, []);

  return <section ref={ref} className="section work-section work-liquid" id="selected-work" aria-labelledby="work-heading"><svg className="work-liquid-defs" width="0" height="0" aria-hidden="true"><defs><filter id="work-liquid-wave" x="-20%" y="-25%" width="140%" height="150%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.002 0.004" numOctaves="1" seed="8" result="wave"/><feDisplacementMap in="SourceGraphic" in2="wave" scale="85" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><div className="container work-stage">
    <div className="section-heading"><div><Eyebrow>Selected client work</Eyebrow><h2 id="work-heading">A world of<br /><em>different stories.</em></h2></div><div><p>Distinctive websites. Considered experiences.<br />A few things we’ve helped bring to life.</p><TextLink to="/projects">View all client work</TextLink></div></div>
    <div className="work-viewport">
      <div className="work-track" onFocusCapture={event => {
        const keyboardFocus = (event.target as HTMLElement).matches(':focus-visible');
        setFocused(keyboardFocus);
        if (!keyboardFocus) return;
        const card = (event.target as HTMLElement).closest<HTMLElement>('.work-card');
        const group = card?.parentElement;
        const tween = tweenRef.current;
        if (!card || !group || !tween) return;
        const track = event.currentTarget;
        const viewport = track.parentElement!;
        const cardOffset = card.offsetLeft - group.offsetLeft;
        const position = Math.max(0, cardOffset - (viewport.clientWidth - card.clientWidth) / 2);
        tween.progress(position / group.offsetWidth).pause();
        viewport.scrollLeft = 0;
      }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}>
        {[0, 1].map(copy => <div className="work-loop-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {featuredClientProjects.map((project, index) => <article className="work-card project-card" data-project={project.slug} key={project.slug}>
            <button type="button" className="work-preview-trigger" aria-label={`Enlarge ${project.name} website`} aria-haspopup="dialog" tabIndex={copy ? -1 : undefined}
              onPointerEnter={event => { if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) openPreview(project, event.currentTarget, 'hover'); }}
              onClick={event => openPreview(project, event.currentTarget, 'click')}>
              <span className="work-card-chrome"><span className="work-window-dots"><i /><i /><i /></span><span className="mono">{project.deliverable}</span><ArrowUpRight size={14} /></span>
              <span className="work-card-screen"><img src={project.image} alt={`${project.name} website design`} width="1280" height="800" loading="lazy" /><span className="work-enlarge"><Maximize2 size={15} /><span>Explore website</span></span></span>
            </button>
            <div className="project-caption"><div><span className="mono">{project.category}</span><h3><a href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined}>{project.name}<ArrowUpRight size={21} /></a></h3></div><span className="project-number mono">{String(index + 1).padStart(2, '0')}</span></div>
            <p>{project.description}</p>
          </article>)}
        </div>)}
      </div>
    </div>
    <div className="work-loop-footer"><span className="work-loop-status mono"><i /><span className="work-desktop-hint">Hover to explore. Click to discover.</span><span className="work-touch-hint">Tap a website to take a closer look.</span></span><button className="work-loop-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play project gallery' : 'Pause project gallery'} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Play' : 'Pause'}</span></button><span className="mono work-project-count">{String(featuredClientProjects.length).padStart(2, '0')} SELECTED PROJECTS</span></div>
  </div>{selection && <WorkPreview selection={selection} onDismiss={dismiss} />}</section>;
}
