import { useId, useState, useLayoutEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { process } from '../data/content';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from '../motion/scroll';
import { Eyebrow } from './UI';

export function Process() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const active = process[selected];
  const root = useRef<HTMLElement>(null);
  const journey = useRef<ScrollTrigger | null>(null);
  function choose(index: number) {
    setSelected(index);
    if (journey.current) scrollToTarget(journey.current.start + (index + .5) / process.length * (journey.current.end - journey.current.start), true);
  }
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(root.current!.querySelector('.process-journey-line'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 50%', scrub: .5 } });
    }, root.current!);
    media.add('(min-width: 1100px) and (min-height: 850px) and (prefers-reduced-motion: no-preference)', () => {
      journey.current = ScrollTrigger.create({ trigger: root.current!.querySelector('.process-layout'), start: 'top 110px', end: '+=1600', pin: true, invalidateOnRefresh: true, onUpdate: self => setSelected(Math.min(process.length - 1, Math.floor(self.progress * process.length))) });
      return () => { journey.current = null; };
    }, root.current!);
    return () => media.revert();
  }, []);
  return <section ref={root} className="process-section section" id="process"><div className="container"><div className="section-heading"><div><Eyebrow>How we make it happen</Eyebrow><h2>Good ideas deserve<br />a clear path forward.</h2></div><p>From the first conversation to the next release, we keep you close to the work.</p></div><div className="process-journey" aria-hidden="true"><i className="process-journey-line"/>{['Understand','Shape','Build','Launch & evolve'].map((label,i)=><span key={label}><b>0{i+1}</b>{label}</span>)}</div><div className="process-layout"><div className="process-tabs" role="tablist" aria-label="Development process" aria-orientation="vertical">{process.map((step, index) => <button key={step.title} id={`${id}-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls={`${id}-panel`} tabIndex={selected === index ? 0 : -1} type="button" onClick={() => choose(index)} onKeyDown={e => { let next = index; if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % process.length; else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index + process.length - 1) % process.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = process.length - 1; else return; e.preventDefault(); choose(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }}><span className="mono">0{index + 1}</span>{step.title}<ArrowRight size={17} /></button>)}</div><div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} className="process-panel grid-paper"><div className="process-panel-content" key={selected}><span className="mono">STEP 0{selected + 1} / 07</span><h3>{active.title}</h3><p>{active.description}</p><div className="process-delivery"><span className="mono">WHAT YOU LEAVE WITH</span><ul>{active.deliverables.map((item,i) => <li key={item}><span className="process-delivery-icon"><Check size={18} /></span><div><span className="mono">DELIVERABLE 0{i+1}</span><strong>{item}</strong></div></li>)}</ul></div></div></div></div></div></section>;
}
