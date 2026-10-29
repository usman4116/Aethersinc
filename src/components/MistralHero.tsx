import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroVisual } from './HeroVisual';
import { PixelA } from './Brand';

gsap.registerPlugin(ScrollTrigger);

function RollingWord({ text }: { text: string }) {
  return <span className="hero-word">{[...text].map((letter, index) => {
    const roll = false;
    return <span className="hero-letter-window" key={index}><span className={`hero-letter ${roll ? 'hero-letter-roll' : ''}`} data-letter-index={index}><span>{letter}</span>{roll && <span className="hero-letter-copy">{letter}</span>}</span></span>;
  })}</span>;
}

export function MistralHero() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const hero = ref.current!;
    const media = gsap.matchMedia();
    let cancelPointer = () => {};
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      media.add({ desktop: '(min-width: 1024px)', animate: '(prefers-reduced-motion: no-preference)' }, match => {
        if (!match.conditions?.animate) return;
        const context = gsap.context(() => {
          const lines = gsap.utils.toArray<HTMLElement>('.hero-headline-line', hero);
          const left = gsap.utils.toArray<HTMLElement>('.hero-rail-left .hero-square', hero);
          const right = gsap.utils.toArray<HTMLElement>('.hero-rail-right .hero-square', hero);
          const floorLeft = gsap.utils.toArray<HTMLElement>('.hero-floor-left .hero-square', hero);
          const floorRight = gsap.utils.toArray<HTMLElement>('.hero-floor-right .hero-square', hero);
          const squares = [...left].reverse().concat(right, floorLeft, [...floorRight].reverse());
          const idle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 5, yoyo: true, defaults: { duration: .8, ease: 'power4.inOut' } });
          const unit = () => left[0].offsetWidth;
          idle.to(floorLeft[0], { width: unit, height: unit, margin: 0, duration: .4 }, 2)
            .to(floorRight[0], { height: 0 })
            .to([left[1], floorLeft[0]], { x: () => -unit() }, '+=.5')
            .to([floorLeft[1], '.hero-mosque'], { x: () => -unit() }, '+=.1')
            .to(floorRight[1], { width: unit, height: unit, rotation: 0, margin: 0 })
            .to(right, { y: unit }, '+=1')
            .to([floorRight[1], right[1]], { x: unit })
            .to([left[0], '.hero-cat'], { y: unit }, '+=.5');
          let opened = false;
          const visibility = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: self => { if (self.isActive && opened) idle.play(); else idle.pause(); } });
          const intro = gsap.timeline({ onComplete: () => {
            opened = true;
            hero.dataset.opened = 'true';
            if (visibility.isActive) idle.play();
          } });
          intro.from(squares, { width: 0, duration: .8, ease: 'power4.out', stagger: .08 }, .4)
            .from('.hero-point', { opacity: 0, duration: .5, stagger: .1 }, 1)
            .from('.hero-announcement', { opacity: 0, y: 8, duration: .6, ease: 'power4.out' }, 1.2);
          lines.forEach((line, lineIndex) => {
            intro.from(line, { height: 0, duration: 1.3, ease: 'power4.inOut', clearProps: 'height' }, lineIndex * .25);
            intro.fromTo(line.querySelectorAll<HTMLElement>('.hero-letter'), { yPercent: 100 }, {
              yPercent: (_, element: HTMLElement) => element.classList.contains('hero-letter-roll') ? -50 : 0,
              duration: 1, ease: 'power4.inOut',
              stagger: (_, element: HTMLElement) => Number(element.dataset.letterIndex) * (1 + Number(element.dataset.letterIndex) % 5) * .005,
            }, lineIndex * .25);
          });
          intro.from('.hero-inline-flag', { yPercent: 100, duration: 1, ease: 'power4.inOut' }, .22);
          gsap.to('.hero-title-parallax', { yPercent: 50, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
          gsap.to('.hero-art', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
          const claw = hero.querySelector<HTMLElement>('.hero-claw')!;
          const move = gsap.quickTo(claw, 'x', { duration: 2, ease: 'power4.inOut' });
          let timer: ReturnType<typeof setTimeout>;
          const pointer = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return;
            clearTimeout(timer);
            timer = setTimeout(() => move(event.clientX - hero.getBoundingClientRect().left - claw.offsetWidth / 2 - hero.clientWidth * .75), 500);
          };
          hero.addEventListener('pointermove', pointer);
          cancelPointer = () => { clearTimeout(timer); hero.removeEventListener('pointermove', pointer); };
          hero.dataset.ready = 'true';
        }, hero);
        return () => { cancelPointer(); context.revert(); delete hero.dataset.opened; };
      });
      ScrollTrigger.refresh();
    });
    return () => { alive = false; cancelPointer(); media.revert(); };
  }, []);

  return <>
    <section className="mistral-hero" ref={ref} aria-labelledby="home-title">
      <div className="hero-center"><div className="hero-title-parallax">
        <h1 id="home-title" className="hero-headline" aria-label="Intelligent software. In your hands.">
          <span className="hero-headline-line" aria-hidden="true"><RollingWord text="Intelligent" /><picture className="hero-inline-flag"><source media="(prefers-reduced-motion: reduce)" srcSet="/hero/flag.png" /><img src="/hero/flag.gif" alt="" width="120" height="120" /></picture><RollingWord text="software." /></span>
          <span className="hero-headline-line" aria-hidden="true"><RollingWord text="In" />{' '}<RollingWord text="your" />{' '}<RollingWord text="hands." /></span>
        </h1>
      </div><Link to="/products" className="hero-announcement"><span className="hero-announcement-icon"><PixelA /></span><span>Explore our products</span><ChevronRight size={17} aria-hidden="true" /></Link></div>
      <HeroVisual />
    </section>
    <div className="hero-platforms" aria-label="Our software platforms"><div className="hero-platforms-track">{[0, 1].map(copy => <div className="hero-platforms-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
      <Link to="/products/purple-ai" className="platform-purple" tabIndex={copy ? -1 : undefined}><span className="platform-symbol">✳</span> purple<span>ai</span></Link>
      <Link to="/products/open-erp" className="platform-erp" tabIndex={copy ? -1 : undefined}>open<span>ERP</span><i /></Link>
      <Link to="/products/corpflow" className="platform-corp" tabIndex={copy ? -1 : undefined}><span className="platform-symbol">▦</span>corpflow</Link>
      <Link to="/products/finraze" className="platform-finraze" tabIndex={copy ? -1 : undefined}>FINRAZE<span>↗</span></Link>
      <Link to="/products/futurepath-ai" className="platform-future" tabIndex={copy ? -1 : undefined}><span className="platform-symbol">⌁</span>FuturePath</Link>
    </div>)}</div></div>
  </>;
}
