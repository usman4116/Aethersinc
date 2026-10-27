import { Fragment, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from '../motion/scroll';

gsap.registerPlugin(ScrollTrigger);

export function DesignPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const root = ref.current!;
    const media = gsap.matchMedia();
    let alive = true;
    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    resize.observe(root);
    document.fonts.ready.then(() => {
      if (!alive) return;
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1000px) and (hover: hover)' }, context => {
        if (!context.conditions?.motion) return;
        gsap.fromTo(root.querySelector('.page-reading-progress'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .2 } });
        gsap.from(root.querySelectorAll('[data-title-line]'), { yPercent: 110, rotate: 2, opacity: 0, duration: 1.05, stagger: .13, ease: 'power4.out', clearProps: 'transform,opacity' });
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element, index) => {
          gsap.from(element, { y: 35, opacity: 0, duration: .9, delay: Math.min(index % 3 * .06, .12), ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        });
        root.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach(element => {
          const length = element.getTotalLength();
          gsap.fromTo(element, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: element.closest('svg'), start: 'top 90%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-word-story]').forEach(block => {
          gsap.fromTo(block.querySelectorAll('[data-story-word]'), { opacity: .22 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: block, start: 'top 82%', end: 'bottom 48%', scrub: .5 } });
        });
        root.querySelectorAll<HTMLElement>('.design-section-heading').forEach(heading => {
          gsap.fromTo(heading, { '--rule-scale': 0 }, { '--rule-scale': 1, ease: 'none', scrollTrigger: { trigger: heading, start: 'top 95%', end: 'bottom 65%', scrub: .4 } });
        });
        root.querySelectorAll<HTMLElement>('.archive-image, .company-founder-portrait').forEach(frame => {
          gsap.fromTo(frame, { clipPath: 'inset(12% 5% 0 5%)' }, { clipPath: 'inset(0% 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 28%', scrub: .6 } });
        });
        root.querySelectorAll<HTMLElement>('.solution-chapter').forEach(chapter => {
          gsap.fromTo(chapter.querySelector('.solution-watermark'), { y: 55 }, { y: -35, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: .7 } });
          gsap.fromTo(chapter.querySelectorAll('li'), { opacity: .3, x: 16 }, { opacity: 1, x: 0, stagger: .12, ease: 'none', scrollTrigger: { trigger: chapter.querySelector('ul'), start: 'top 90%', end: 'bottom 60%', scrub: .5 } });
        });
        const blueprint = root.querySelector('.solution-blueprint-path');
        if (blueprint) gsap.fromTo(blueprint, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root.querySelector('.solutions-body'), start: 'top 55%', end: 'bottom 60%', scrub: .5 } });
        const cleanup: (() => void)[] = [];
        if (context.conditions?.desktop) {
          const intro = root.querySelector('.products-intro, .solutions-intro, .portfolio-intro, .company-intro, .platform-detail-intro');
          if (intro) gsap.to(intro.querySelector('h1'), { y: 65, ease: 'none', scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom top', scrub: .6 } });
          const compass = root.querySelector('.company-compass > svg');
          if (compass) gsap.to(compass, { rotation: 26, ease: 'none', scrollTrigger: { trigger: root.querySelector('.company-intro'), start: 'top top', end: 'bottom top', scrub: .7 } });
          const values = [...root.querySelectorAll<HTMLElement>('.company-value-grid > article')];
          values.slice(0, -1).forEach((card, i) => gsap.to(card, { scale: .94, rotate: -.7, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: values[i+1], start: 'top 80%', end: 'top 24%', scrub: .5 } }));
          root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => {
            gsap.fromTo(element, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: .7 } });
          });
          root.querySelectorAll<HTMLElement>('[data-tilt]').forEach(element => {
            const x = gsap.quickTo(element, 'rotationY', { duration: .9, ease: 'power3.out' });
            const y = gsap.quickTo(element, 'rotationX', { duration: .9, ease: 'power3.out' });
            const move = (event: PointerEvent) => {
              const rect = element.getBoundingClientRect();
              x(((event.clientX - rect.left) / rect.width - .5) * 9);
              y(-((event.clientY - rect.top) / rect.height - .5) * 9);
            };
            const leave = () => { x(0); y(0); };
            element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
            cleanup.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); });
          });
        }
        return () => cleanup.forEach(fn => fn());
      }, root);
      ScrollTrigger.refresh();
    });
    return () => { alive = false; resize.disconnect(); cancelAnimationFrame(resizeFrame); media.revert(); };
  }, [pathname]);
  return <div ref={ref} className={`design-page ${className}`}><div className="page-reading-progress" aria-hidden="true" />{children}</div>;
}

export function StoryWords({ text }: { text: string }) {
  return <>{text.split(' ').map((word, i) => <Fragment key={`${word}-${i}`}>{i > 0 && ' '}<span data-story-word>{word}</span></Fragment>)}</>;
}

export function TitleLine({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`design-title-mask ${className}`}><span data-title-line>{children}</span></span>;
}

export function PageScrollLink({ target, children }: { target: string; children: ReactNode }) {
  return <a className="design-scroll-link" href={target} onClick={event => { event.preventDefault(); scrollToTarget(target); }}><span>{children}</span><ArrowDown size={16} /></a>;
}

export function PageEnd({ children, note = 'A conversation is a good place to start.' }: { children: ReactNode; note?: string }) {
  return <section className="design-end"><div className="container" data-reveal><div><span className="mono">Your next chapter</span><h2>{children}</h2></div><div><Link to="/contact" className="design-end-link" aria-label="Start a conversation"><ArrowUpRight strokeWidth={1.2} /></Link><p>{note}</p></div></div></section>;
}
