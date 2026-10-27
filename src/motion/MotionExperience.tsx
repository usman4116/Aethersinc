import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from './scroll';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function MotionExperience() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 1000px)', animate: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.animate) return;
      const desktop = context.conditions.desktop;
      const root = document.getElementById('main')!;
      const intro = root.querySelector('.hero-content, .page-hero .container, .contact-page > .container, .product-detail-hero .container');
      if (intro) {
        const items = intro.querySelectorAll('.eyebrow, .hero-line > span, h1:not(.motion-title), .lede, p:not(.eyebrow), .hero-actions, .page-hero-bottom, .back-link');
        gsap.from(items, { y: 32, opacity: 0, stagger: 0.085, duration: 0.95, ease: 'power3.out', clearProps: 'transform,opacity' });
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

  return null;
}
