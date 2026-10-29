import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, Sparkles, Layers3, Workflow } from 'lucide-react';
import gsap from 'gsap';

export function IdeFeature() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [requested, setRequested] = useState<boolean | null>(null);
  useEffect(() => {
    const video = videoRef.current!;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && (requested ?? !preference.matches)) video.play().catch(() => setPlaying(false));
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(video);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [requested]);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.ide-film', { scale: .88, rotationX: 7 }, { scale: 1, rotationX: 0, ease: 'none', scrollTrigger: { trigger: '.ide-film', start: 'top 95%', end: 'top 22%', scrub: .6 } });

    }, ref.current!);
    return () => media.revert();
  }, []);
  return <section className="ide-feature" ref={ref} aria-labelledby="ide-title"><div className="container">
    <div className="ide-topline"><span className="mono"><i/>MADE IN PAKISTAN. BUILT FOR WHAT’S NEXT.</span><span className="mono">AETHERSYNC IDE / NOW AVAILABLE</span></div>
    <div className="ide-showcase"><div className="ide-heading"><span className="ide-product-badge"><Sparkles size={15} /> AETHERSYNC IDE</span><h2 id="ide-title">An idea.<br />An open editor.<br /><em>Endless possibility.</em></h2><p className="ide-origin">Pakistan’s first AI-powered IDE.</p><p>Bring agents, your favorite models, and your entire workspace together. A considered space to build what comes next.</p><a href="https://ide.theaethersync.com/" target="_blank" rel="noopener noreferrer" className="ide-launch">Explore the IDE<ArrowUpRight size={20}/></a><span className="ide-small-note">From your first idea to your next release.</span></div>
    <div className="ide-cinema"><div className="ide-cinema-caption"><span className="mono">A CLOSER LOOK</span><span className="mono">01 — THE INTRODUCTION</span></div>
    <div className="ide-film"><div className="ide-film-bar"><span className="ide-film-dots"><i/><i/><i/></span><span className="mono">AETHERSYNC IDE — THE INTRODUCTION</span><button type="button" onClick={()=>setRequested(!playing)} aria-label={playing?'Pause IDE video':'Play IDE video'}>{playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?'Pause':'Play'}</span></button></div><video ref={videoRef} src="/media/ide-demo.mp4" poster="/media/ide-poster.jpg" muted loop playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label="Aethersync IDE introduction video"/><a className="ide-film-link" href="https://ide.theaethersync.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Aethersync IDE"><ArrowUpRight size={23}/></a></div>
    <div className="ide-cinema-footer"><span><i /> Built for your flow.</span><span>Ideas → Intelligence → Execution</span></div></div></div>
    <div className="ide-feature-foot">{[
      { icon: Sparkles, title: 'An agent by your side.', text: 'Move from intent to implementation with agentic coding.' },
      { icon: Layers3, title: 'Your models. Your choice.', text: 'Bring your favorite intelligence into the way you work.' },
      { icon: Workflow, title: 'Everything, connected.', text: 'Keep your code, agents, and workspace in one place.' },
    ].map(({ icon: Icon, title, text }, index) => <div className="ide-benefit" key={title}><div className="ide-benefit-top"><Icon size={21} strokeWidth={1.3}/><span className="mono">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div>
  </div></section>;
}
