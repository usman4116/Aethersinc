import { ProductBlueprint } from './ProductBlueprint';
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/content';
import { Status } from './ProductCard';
import { Eyebrow, TextLink } from './UI';
import { scrollToTarget } from '../motion/scroll';

gsap.registerPlugin(ScrollTrigger);
const chapters = [
  { title: 'Intelligence', line: 'Give the busywork\nto intelligence.', product: products[0] },
  { title: 'Operations', line: 'Every branch.\nOne clear picture.', product: products[1] },
  { title: 'Connection', line: 'Less friction.\nMore flow.', product: products[2] },
  { title: 'Clarity', line: 'Make the numbers\nmake sense.', product: products[3] },
];

export function ProductStory() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      const section = root.current!;
      const panels = gsap.utils.toArray<HTMLElement>('.story-panel', section);
      const stage = section.querySelector('.story-stage')!;
      setPinned(true);
      section.classList.add('story-is-pinned');
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage, pin: true, start: 'top 96px',
          end: () => '+=' + Math.max(window.innerHeight * 2.7, 2200),
          scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => setActive(Math.min(3, Math.floor(self.progress * 4))),
        },
      });
      timeline.to({}, { duration: 0.7 });
      panels.slice(1).forEach((panel, index) => {
        const at = index + 0.72;
        timeline.to(panels[index], { autoAlpha: 0, y: -22, duration: 0.27, ease: 'power2.inOut' }, at);
        timeline.fromTo(panel, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power2.out' }, at + 0.08);
      });
      timeline.to({}, { duration: 0.65 });
      panels.forEach((panel, index) => {
        timeline.fromTo(panel.querySelector('.product-symbol'), { scale: 0.88 }, { scale: 1, duration: 0.65, ease: 'none' }, index + 0.05);
        timeline.fromTo(panel.querySelectorAll('.blueprint-step'), { x: 18, opacity: .35 }, { x: 0, opacity: 1, stagger: .1, duration: .35 }, index + .05);
      });
      trigger.current = timeline.scrollTrigger!;
      return () => { trigger.current = null; setPinned(false); section.classList.remove('story-is-pinned'); };
    });
    return () => media.revert();
  }, []);

  function select(index: number) {
    if (trigger.current) scrollToTarget(trigger.current.start + ((index + 0.4) / 4) * (trigger.current.end - trigger.current.start));
    else scrollToTarget('#story-' + index);
  }

  return <section ref={root} className="product-story section" id="possibilities">
    <div className="container">
      <div className="section-heading">
        <div><Eyebrow>Intelligence, put to work</Eyebrow><h2>Four ways to move<br />your business forward.</h2></div>
        <p>Explore the ecosystem as you scroll. Each platform takes care of a different part of the work.</p>
      </div>
      <div className="story-stage">
        <div className="story-navigation">
          <span className="mono story-label">THE AETHERSYNC ECOSYSTEM</span>
          <div className="story-chapters" aria-label="Product story chapters">{chapters.map((chapter, index) =>
            <button key={chapter.title} type="button" aria-current={pinned && active === index ? 'step' : undefined} onClick={() => select(index)}>
              <span className="mono">0{index + 1}</span><span>{chapter.title}</span><ArrowUpRight size={14} />
            </button>
          )}</div>
          <div className="story-readout"><span className="story-current">0{active + 1}</span><span className="mono">/ 04<br />SCROLL TO CONTINUE</span><ArrowDown size={18} /></div>
        </div>
        <div className="story-panels">{chapters.map((chapter, index) =>
          <article key={chapter.product.slug} id={'story-' + index} className="story-panel" aria-hidden={pinned && active !== index ? true : undefined} {...(pinned && active !== index ? { inert: '' } : {})}>
            <div className="story-copy">
              <span className="mono story-category">{chapter.product.category}</span>
              <h3>{chapter.line.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h3>
              <p>{chapter.product.description}</p>
              <Status status={chapter.product.status} />
              <Link to={'/products/' + chapter.product.slug} className="text-link">Explore {chapter.product.name}<ArrowUpRight size={16} /></Link>
            </div>
            <div className="story-art"><ProductBlueprint product={chapter.product} /><span className="story-product-name">{chapter.product.name}</span></div>
          </article>
        )}</div>
      </div>
      <div className="story-endnote"><span className="mono">DESIGNED TO WORK TOGETHER.</span><TextLink to="/products">All seven platforms</TextLink></div>
    </div>
  </section>;
}
