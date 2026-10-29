import { ServiceLinks } from '../components/DiscoveryContent';
import { InteriorHeroFrame } from '../components/InteriorHeroFrame';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { advantages, services } from '../data/content';
import { Process } from '../components/Process';
import { DesignPage, PageEnd, StoryWords, TitleLine } from '../components/DesignPage';
import { EngineeringDiagram } from '../components/DesignArt';
import { scrollToTarget } from '../motion/scroll';

export default function Services() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(Number((visible[0].target as HTMLElement).dataset.index));
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    listRef.current?.querySelectorAll('[data-index]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const ActiveIcon = services[active].icon;
  return <DesignPage className="solutions-design">
    <section className="solutions-intro premium-interior-hero"><InteriorHeroFrame variant="solutions" /><div className="container"><div className="solutions-topline mono"><span>Solutions / 02</span><span>From the first idea to what comes next.</span></div><div className="solutions-intro-grid"><div><h1><TitleLine>Complexity,</TitleLine><TitleLine><em>meet clarity.</em></TitleLine></h1><p data-reveal>Your ambition deserves good engineering.<br />We bring the thinking, the craft, and the code.</p><Link to="/contact" className="design-button" data-reveal>Let’s build something<ArrowUpRight size={20} /></Link></div><EngineeringDiagram /></div><a href="#solutions" className="solutions-scroll mono" onClick={event => { event.preventDefault(); scrollToTarget('#solutions'); }}><span>Six disciplines. One connected team.</span><ArrowDown size={19} /></a></div></section>
    <section className="solutions-body container" id="solutions"><aside className="solutions-index"><div className="solution-index-art" aria-hidden="true"><svg viewBox="0 0 240 160" fill="none"><path d="M10 35h65v90h70V35h85" stroke="currentColor" strokeOpacity=".15" strokeWidth="2"/><path className="solution-blueprint-path" pathLength="1" strokeDasharray="1" d="M10 35h65v90h70V35h85" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="35" r="4" fill="currentColor"/><circle cx="230" cy="35" r="4" fill="currentColor"/></svg><ActiveIcon size={40} strokeWidth={1}/><strong>0{active+1}</strong><span className="mono">CONNECTED DISCIPLINES / 06</span></div><span className="mono">Find your next move</span><nav aria-label="Solution disciplines">{services.map((service,index) => <a key={service.slug} href={`#${service.slug}`} aria-current={active===index?'location':undefined} onClick={event => { event.preventDefault(); setActive(index); scrollToTarget(`#${service.slug}`); }}><span className="mono">0{index+1}</span><span>{service.title}</span><ArrowRight size={16} /></a>)}</nav><Link to="/contact" className="solutions-index-contact">Start a conversation<ArrowUpRight size={16} /></Link></aside><div className="solutions-articles" ref={listRef}>{services.map((service,index) => <article className="solution-chapter" id={service.slug} key={service.slug} data-index={index}><div className="solution-chapter-top"><span className="mono">DISCIPLINE 0{index+1} / 06</span><service.icon size={28} strokeWidth={1.2} /></div><div className="solution-chapter-content" data-reveal><span className="solution-watermark" aria-hidden="true">0{index+1}</span><h2 data-word-story><StoryWords text={service.fullTitle}/></h2><p>{service.description}</p><ul>{service.points.map(point => <li key={point}><Check size={15} />{point}</li>)}</ul><Link to={`/contact?interest=${encodeURIComponent(service.title)}`} className="design-inline-link">Let’s build together<ArrowUpRight size={18} /></Link></div></article>)}</div></section>
    <section className="solutions-principles"><div className="container"><div className="design-section-heading" data-reveal><div><span className="design-kicker mono">The way we work</span><h2>Real experience.<br /><em>Considered decisions.</em></h2></div><p>We build our own products, too.<br />That practical experience shapes every solution we create for you.</p></div><div className="principles-grid">{advantages.map(([title,copy],index) => <article key={title} data-reveal><span className="mono">0{index+1} —</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <ServiceLinks /><div className="solutions-process"><Process /></div>
    <PageEnd>Bring us<br /><em>the hard part.</em></PageEnd>
  </DesignPage>;
}
