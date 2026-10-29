import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { services } from '../data/content';
export function ServiceFlow({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const service = services[active];
  const Icon = service.icon;
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.fromTo(ref.current!.querySelector('.service-flow-line'),{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:ref.current,start:'top 85%',end:'bottom 60%',scrub:.5}});
    },ref.current!);
    return ()=>media.revert();
  },[]);
  return <div className="service-flow" ref={ref}><div className="blueprint-top"><span className="mono">FROM CHALLENGE TO CAPABILITY</span><Icon size={21}/></div><div className="service-flow-steps" key={active}><i className="service-flow-line"/>{['Understand your workflow',service.title,service.points[service.points.length-1]].map((label,i)=><div key={label}><span>0{i+1}</span><strong>{label}</strong></div>)}</div><span className="mono">THINK CLEARLY. BUILD PURPOSEFULLY.</span></div>;
}
