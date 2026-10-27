import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
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
      gsap.fromTo('.ide-giant-label', { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    }, ref.current!);
    return () => media.revert();
  }, []);
  return <section className="ide-feature" ref={ref} aria-labelledby="ide-title"><div className="container">
    <div className="ide-topline"><span className="mono"><i/>MADE IN PAKISTAN. BUILT FOR WHAT’S NEXT.</span><span className="mono">AETHERSYNC IDE / NOW AVAILABLE</span></div>
    <div className="ide-heading"><h2 id="ide-title">Pakistan’s first<br /><em>AI-powered IDE.</em></h2><div><p>From your first idea to your next release. An AI code editor that brings agents, your favorite models, and your entire workspace together.</p><a href="https://ide.theaethersync.com/" target="_blank" rel="noopener noreferrer" className="ide-launch">Explore Aethersync IDE<ArrowUpRight size={20}/></a></div></div>
    <div className="ide-film"><div className="ide-film-bar"><span className="ide-film-dots"><i/><i/><i/></span><span className="mono">AETHERSYNC IDE — THE INTRODUCTION</span><button type="button" onClick={()=>setRequested(!playing)} aria-label={playing?'Pause IDE video':'Play IDE video'}>{playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?'Pause':'Play'}</span></button></div><video ref={videoRef} src="/media/ide-demo.mp4" poster="/media/ide-poster.jpg" muted loop playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label="Aethersync IDE introduction video"/><a className="ide-film-link" href="https://ide.theaethersync.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Aethersync IDE"><ArrowUpRight size={23}/></a></div>
    <div className="ide-feature-foot"><span>01 / Agentic coding</span><span>02 / Your choice of models</span><span>03 / One connected workspace</span></div>
    <div className="ide-giant-label" aria-hidden="true">Your next idea, in motion.</div>
  </div></section>;
}
