import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from './scroll';
import './page-story.css';

const stories: Record<string, [string, string][]> = {
  '/': [['The idea', '.mistral-hero'], ['Possibilities', '.product-story'], ['Your business', '.services-section'], ['The work', '.work-section'], ['Your workspace', '.ide-feature'], ['Build together', '.process-section']],
  '/products': [['The ecosystem', '.products-intro'], ['The connections', '.ecosystem-journey'], ['Find your platform', '.platform-catalog'], ['Made for you', '.product-bespoke']],
  '/services': [['The ambition', '.solutions-intro'], ['The disciplines', '.solutions-body'], ['Our approach', '.solutions-principles'], ['The journey', '.process-section']],
  '/projects': [['A point of view', '.portfolio-intro'], ['Featured stories', '.work-reel'], ['The collection', '.work-archive']],
  '/about': [['Our people', '.company-intro'], ['Our belief', '.company-manifesto'], ['Our beginning', '.company-story'], ['Our journey', '.company-timeline'], ['Our principles', '.company-values'], ['Meet the founder', '.company-founders']],
  '/contact': [['A conversation', '.contact-page h1'], ['Your idea', '.contact-form-wrap']],
};
const productStory: [string, string][] = [['The platform', '.platform-detail-intro'], ['The capabilities', '.platform-capabilities'], ['Better together', '.platform-related']];
const serviceStory: [string, string][] = [['The ambition', '.discovery-intro'], ['The starting point', '.discovery-fit'], ['The foundations', '.discovery-outcomes'], ['The delivery', '.discovery-delivery'], ['Your questions', '.discovery-questions']];
const founderStory: [string, string][] = [['Meet Usman', '.founder-profile-intro'], ['The purpose', '.discovery-delivery'], ['The work', '.discovery-proof'], ['Your questions', '.discovery-questions']];

export function PageStory() {
  const { pathname } = useLocation();
  const chapters = stories[pathname] || (pathname.startsWith('/products/') ? productStory : pathname.startsWith('/services/') ? serviceStory : pathname === '/about/usman-farhan' ? founderStory : []);
  const [active, setActive] = useState(0);
  const nav = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    setActive(0);
    let alive = true;
    const media = gsap.matchMedia();
    document.fonts.ready.then(() => {
      if (!alive) return;
      const root = document.getElementById('main')!;
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1000px)' }, context => {
        chapters.forEach(([, selector], i) => {
          const element = root.querySelector(selector);
          if (element) ScrollTrigger.create({ trigger: element, start: 'top 55%', end: 'bottom 55%', onEnter: () => setActive(i), onEnterBack: () => setActive(i) });
        });
        if (!context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        if (nav.current) gsap.fromTo(nav.current, { '--story-progress': 0 }, { '--story-progress': 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .3 } });
        const reveal = (selector: string, distance = 26) => root.querySelectorAll<HTMLElement>(selector).forEach(element => {
          gsap.fromTo(element, { y: distance, opacity: .35 }, { y: 0, opacity: 1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
        });
        // Architectural outlines become a drawn threshold into each page.
        root.querySelectorAll<SVGPathElement>('.interior-hero-vault path').forEach((path, i) => {
          const length = path.getTotalLength();
          gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6, delay: i * .12, ease: 'power2.out' });
        });
        root.querySelectorAll<HTMLElement>('.chapter-bridge').forEach(bridge => {
          gsap.fromTo(bridge, { '--chapter-fill': 0 }, { '--chapter-fill': 1, ease: 'none', scrollTrigger: { trigger: bridge, start: 'top 90%', end: 'top 40%', scrub: .5 } });
          gsap.from(bridge.querySelector('p'), { x: desktop ? 35 : 12, opacity: .2, duration: .8, scrollTrigger: { trigger: bridge, start: 'top 85%', once: true } });
        });
        if (pathname === '/') {
          reveal('.ide-benefit, .accordion-item');
        } else if (pathname === '/products') {
          reveal('.platform-tile', desktop ? 45 : 20);
          root.querySelectorAll('.platform-tile-art').forEach(art => gsap.fromTo(art, { '--card-reveal': '100%' }, { '--card-reveal': '0%', ease: 'none', scrollTrigger: { trigger: art, start: 'top 90%', end: 'top 45%', scrub: .5 } }));
        } else if (pathname === '/services') {
          root.querySelectorAll<HTMLElement>('.solution-chapter').forEach(chapter => gsap.fromTo(chapter, { '--chapter-fill': 0 }, { '--chapter-fill': 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 70%', end: 'bottom 50%', scrub: .4 } }));
        } else if (pathname === '/projects') {
          reveal('.archive-project-heading, .archive-project > p, .archive-tags');
          reveal('.reel-story-details > div');
        } else if (pathname === '/about') {
          gsap.fromTo('.company-human img', { scale: 1.09 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
          root.querySelectorAll<HTMLElement>('.company-timeline article').forEach((article, i) => gsap.fromTo(article, { '--chapter-fill': 0 }, { '--chapter-fill': 1, ease: 'none', scrollTrigger: { trigger: article, start: `top ${85 - i * 8}%`, end: 'top 35%', scrub: .4 } }));
        } else if (pathname.startsWith('/products/')) {
          reveal('.platform-detail-art .blueprint-step');
          reveal('.capability-grid > div', desktop ? 40 : 20);
          reveal('.platform-related-grid > article');
        } else if (pathname === '/contact') {
          reveal('.contact-next, .form-heading, .form-grid > label, .form-submit-row', 18);
        } else {
          reveal('.not-found .pixel-a, .not-found h1, .not-found p');
        }
        // A shared closing gesture provides a quiet resolution after every story.
        root.querySelectorAll<HTMLElement>('.design-end, .contact-cta').forEach(end => {
          gsap.fromTo(end, { '--closing-light': 0 }, { '--closing-light': 1, ease: 'none', scrollTrigger: { trigger: end, start: 'top 95%', end: 'top 35%', scrub: .6 } });
        });
      }, root);
      ScrollTrigger.refresh();
    });
    return () => { alive = false; media.revert(); };
  }, [pathname]);
  if (!chapters.length) return null;
  return <nav ref={nav} className="page-story-nav" aria-label="Page story chapters"><span className="page-story-label">THE STORY <b>{String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</b></span><div>{chapters.map(([label, selector], i) => <button key={selector} type="button" aria-current={active === i ? 'step' : undefined} onClick={() => scrollToTarget(selector)}><i aria-hidden="true"/><span>{label}</span></button>)}</div><span className="page-story-line" aria-hidden="true"/></nav>;
}
