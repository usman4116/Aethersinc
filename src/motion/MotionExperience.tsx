import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setScrollController, scrollToTarget } from './scroll';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function MotionExperience() {
  const { pathname } = useLocation();
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: node => Boolean(node.closest('[data-lenis-prevent], textarea, select, .mobile-nav, .nav-dropdown')),
      });
      setScrollController(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      document.documentElement.classList.add('motion-enabled');
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setScrollController(null);
        document.documentElement.classList.remove('motion-enabled');
      };
    });
    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 1000px)', animate: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.animate) return;
      const desktop = context.conditions.desktop;
      const root = document.getElementById('main')!;
      const header = document.querySelector('.site-header');
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.to(progressRef.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
      ScrollTrigger.create({
        start: 48, end: 'max',
        onToggle: self => header?.classList.toggle('header-scrolled', self.isActive),
      });

      const intro = root.querySelector('.hero-content, .page-hero .container, .contact-page > .container, .product-detail-hero .container');
      if (intro) {
        const items = intro.querySelectorAll('.eyebrow, .hero-line > span, h1:not(.motion-title), .lede, p:not(.eyebrow), .hero-actions, .page-hero-bottom, .back-link');
        gsap.from(items, { y: 32, opacity: 0, stagger: 0.085, duration: 0.95, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
      const system = root.querySelector('.hero-system');
      if (system) {
        gsap.from(system, { opacity: 0, duration: 1.2, delay: 0.15, ease: 'power3.out' });
        gsap.from(system.querySelectorAll('.system-node'), { opacity: 0, y: 24, scale: 0.94, stagger: 0.13, delay: 0.5, duration: 0.8, ease: 'power3.out' });
        gsap.from(system.querySelectorAll('.system-core .pixel-a rect'), { opacity: 0, scale: 0.15, transformOrigin: 'center', stagger: { amount: 0.65, from: 'random' }, delay: 0.45, duration: 0.55, ease: 'power2.out' });
        gsap.from(system.querySelector('.system-lines'), { scaleX: 0, transformOrigin: 'left center', duration: 1.1, delay: 0.4, ease: 'power2.out' });
        const idle = gsap.to(system.querySelectorAll('.system-pixel'), { y: -9, duration: 2, stagger: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
        ScrollTrigger.create({ trigger: system, start: 'top bottom', end: 'bottom top', onToggle: self => { if (self.isActive) idle.play(); else idle.pause(); } });
        if (desktop) {
          gsap.to(system, { y: 90, rotation: -2.5, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
          gsap.to('.hero-content', { y: -45, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
        }
      }

      root.querySelectorAll<HTMLElement>('.section-heading h2, .services-intro h2, .about-story h2, .about-disciplines h2, .vision-section h2, .cta-inner h2').forEach(heading => {
        gsap.from(heading, { y: 38, opacity: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 92%', toggleActions: 'play none none reverse' } });
      });
      root.querySelectorAll<HTMLElement>('.scroll-word').forEach((word, index) => {
        gsap.fromTo(word, { opacity: 0.2, y: 18 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.statement-section', start: 'top ' + (83 - index * 4) + '%', end: 'center ' + (60 - index * 3) + '%', scrub: 0.5 } });
      });
      root.querySelectorAll<HTMLElement>('.feature-grid > div, .advantages-grid > div, .about-discipline-grid > div').forEach((card, index) => {
        gsap.from(card, { y: 36, opacity: 0, duration: 0.8, delay: (index % 3) * 0.07, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none reverse' } });
      });
      if (desktop) {
        root.querySelectorAll<HTMLElement>('.futurepath-image img, .founder-photo img, .projects-grid .project-image img').forEach(image => {
          gsap.fromTo(image, { yPercent: -4, scale: 1.1 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
        });
        const ctaMark = root.querySelector('.cta-mark');
        if (ctaMark) gsap.to(ctaMark, { rotation: 12, y: -30, ease: 'none', scrollTrigger: { trigger: '.contact-cta', start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
      }
      const footer = document.querySelector('.footer-wordmark');
      if (footer) gsap.from(footer.children, { yPercent: 65, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 98%', end: 'bottom 93%', scrub: 0.6 } });
    });
    const frame = requestAnimationFrame(() => {
      if (!window.location.hash || window.location.hash.startsWith('#/')) scrollToTarget(0, true);
      ScrollTrigger.refresh();
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => { cancelAnimationFrame(frame); media.revert(); document.querySelector('.site-header')?.classList.remove('header-scrolled'); };
  }, [pathname]);

  return <div className="reading-progress" aria-hidden="true"><div ref={progressRef} /></div>;
}
