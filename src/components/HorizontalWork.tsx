import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredClientProjects } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { Eyebrow, TextLink } from './UI';
import { scrollToTarget } from '../motion/scroll';

gsap.registerPlugin(ScrollTrigger);

export function HorizontalWork() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      const root = ref.current!;
      const stage = root.querySelector('.work-stage')!;
      const track = root.querySelector<HTMLElement>('.work-track')!;
      const viewport = root.querySelector<HTMLElement>('.work-viewport')!;
      root.classList.add('work-is-horizontal');
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const animation = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: {
        trigger: stage, pin: true, start: 'top 96px', end: () => '+=' + Math.max(distance(), 800),
        scrub: 0.85, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => setActive(Math.min(featuredClientProjects.length, Math.floor(self.progress * featuredClientProjects.length) + 1)),
      } });
      const focus = (event: FocusEvent) => {
        const card = (event.target as HTMLElement).closest('.work-card');
        if (!card || !animation.scrollTrigger) return;
        const index = [...track.children].indexOf(card);
        const progress = index / (featuredClientProjects.length - 1);
        scrollToTarget(animation.scrollTrigger.start + progress * (animation.scrollTrigger.end - animation.scrollTrigger.start), true);
      };
      track.addEventListener('focusin', focus);
      return () => { root.classList.remove('work-is-horizontal'); track.removeEventListener('focusin', focus); };
    });
    return () => media.revert();
  }, []);
  return <section ref={ref} className="section work-section" id="selected-work"><div className="container work-stage">
    <div className="section-heading"><div><Eyebrow>Selected client work</Eyebrow><h2>Ideas out in<br />the real world.</h2></div><div><p>Distinctive websites. Considered experiences.<br />A few things we’ve helped bring to life.</p><TextLink to="/projects">View all client work</TextLink></div></div>
    <div className="work-viewport"><div className="work-track">{featuredClientProjects.map((project, index) => <div className="work-card" key={project.slug}><ProjectCard project={project} index={index} /></div>)}</div></div>
    <div className="work-scroll-hint"><span className="mono">SCROLL TO EXPLORE THE WORK<ArrowRight size={17} /></span><span className="mono">0{active} / 0{featuredClientProjects.length}</span></div>
  </div></section>;
}
