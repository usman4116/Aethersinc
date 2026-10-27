import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredClientProjects, type ClientProject } from '../data/projects';
import { scrollToTarget } from '../motion/scroll';

export function WorkReel({ onOpen }: { onOpen: (project: ClientProject, source: HTMLButtonElement) => void }) {
  const ref = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const root = ref.current!;
    const panels = [...root.querySelectorAll<HTMLElement>('.reel-project')];
    const media = gsap.matchMedia();
    const expose = (index: number, pinned: boolean) => {
      setActive(index);
      panels.forEach((panel, i) => { panel.inert = pinned && i !== index; panel.setAttribute('aria-hidden', String(pinned && i !== index)); });
    };
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      media.add('(min-width: 1000px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)', () => {
        root.classList.add('reel-is-pinned');
        expose(0, true);
        const timeline = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.reel-stage'), start: 'top 68px', end: () => '+=' + innerHeight * 2.6, pin: true, scrub: .6, invalidateOnRefresh: true, onUpdate: self => expose(self.progress * 3 >= 2.35 ? 2 : self.progress * 3 >= 1.35 ? 1 : 0, true) } });
        timeline.to({}, { duration: 1 });
        panels.slice(1).forEach((panel, offset) => {
          const i = offset + 1;
          timeline.fromTo(panel, { yPercent: 105, rotation: 2 }, { yPercent: 0, rotation: 0, ease: 'none', duration: .75 }, i)
            .to(panels[i-1], { scale: .93, yPercent: -4, opacity: .3, ease: 'none', duration: .75 }, i);
        });
        timeline.to({}, { duration: .25 }, 2.75);
        trigger.current = timeline.scrollTrigger!;
        return () => { trigger.current = null; root.classList.remove('reel-is-pinned'); expose(0, false); };
      }, root);
      ScrollTrigger.refresh();
    });
    return () => { alive = false; media.revert(); panels.forEach(panel => { panel.inert = false; panel.removeAttribute('aria-hidden'); }); };
  }, []);
  const jump = (index: number) => {
    if (trigger.current) scrollToTarget(trigger.current.start + ((index + .85) / 3) * (trigger.current.end - trigger.current.start));
    else { setActive(index); scrollToTarget(ref.current!.querySelectorAll<HTMLElement>('.reel-project')[index]); }
  };
  return <section className="work-reel" ref={ref} aria-label="Featured project stories"><div className="container">
    <div className="reel-stage"><div className="reel-toolbar"><span className="mono">THREE STORIES. THREE DIFFERENT WORLDS.</span><span className="reel-scroll-hint mono">SCROLL TO DISCOVER <ArrowDown size={14}/></span></div>
      <div className="reel-canvas">{featuredClientProjects.map((project,i)=><article className={`reel-project reel-${project.slug}`} key={project.slug} data-project={project.slug}>
        <div className="reel-copy"><span className="mono">0{i+1} / {project.category}</span><h2>{project.name}</h2><p>{project.description}</p><span className="reel-deliverable">{project.deliverable}</span><a href={project.url} target="_blank" rel="noopener noreferrer" className="design-inline-link">Visit live website<ArrowUpRight size={17}/></a></div>
        <button type="button" className="reel-screen" aria-label={`Enlarge ${project.name} website`} aria-haspopup="dialog" onClick={event=>onOpen(project,event.currentTarget)}><span className="reel-browser"><span><i/><i/><i/></span><span>{project.name}</span><ArrowUpRight size={14}/></span><img src={project.image} alt={`${project.name} website design`} width="1280" height="800"/><span className="reel-enlarge"><Maximize2 size={17}/>Take a closer look</span></button>
        <span className="reel-oversized-number" aria-hidden="true">0{i+1}</span>
      </article>)}</div>
      <div className="reel-controls" role="group" aria-label="Featured project chapters">{featuredClientProjects.map((project,i)=><button key={project.slug} type="button" aria-pressed={active===i} onClick={()=>jump(i)}><span className="mono">0{i+1}</span>{project.name}<span className="reel-control-line"/></button>)}</div>
    </div>
  </div></section>;
}
