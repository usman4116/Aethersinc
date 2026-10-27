import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PixelA } from './Brand';

const chapters = [
  { title: 'Start with a question.', accent: 'Find a better answer.', copy: 'Give curiosity somewhere to go. Intelligent assistants and verification tools help turn information into useful direction.', names: 'Purple AI · Fact Checking', to: '/products/purple-ai', label: 'Explore Purple AI' },
  { title: 'Bring the work together.', accent: 'Make room for more.', copy: 'Connect the everyday details. From internal tools to pickup and delivery, bring the moving parts of a business into view.', names: 'Open ERP · Corpflow · Laundry Management', to: '/products/open-erp', label: 'Explore Open ERP' },
  { title: 'See what comes next.', accent: 'Choose with clarity.', copy: 'Understand the numbers. Explore the possibilities. Build a clearer picture of your next business or personal decision.', names: 'Finraze · FuturePath AI', to: '/products/futurepath-ai', label: 'Explore FuturePath AI' },
];

export function ProductJourney() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const root = ref.current!;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 681px)' }, context => {
      if (!context.conditions?.motion) return;
      if (!context.conditions.wide) {
        root.querySelectorAll('.ecosystem-chapter').forEach(chapter => gsap.fromTo(chapter.querySelector('h3'), { y: 25, opacity: .4 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 90%', end: 'top 50%', scrub: .4 } }));
        return;
      }
      root.querySelectorAll<HTMLElement>('.ecosystem-chapter').forEach((chapter, i) => {
        const cluster = root.querySelector(`.ecosystem-cluster-${i}`);
        const path = root.querySelector<SVGPathElement>(`.ecosystem-path-${i}`)!;
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 85%', end: 'top 35%', scrub: .5 } });
        gsap.fromTo(cluster, { opacity: .12, scale: .83, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 80%', end: 'top 35%', scrub: .5 } });
        ScrollTrigger.create({ trigger: chapter, start: 'top 55%', end: 'bottom 55%', onEnter: () => setActive(i), onEnterBack: () => setActive(i) });
      });
    }, root);
    return () => media.revert();
  }, []);
  return <section className="ecosystem-journey" ref={ref} aria-label="How the Aethersync ecosystem connects">
    <div className="container ecosystem-layout">
      <div className="ecosystem-sticky"><span className="mono">Different strengths. One point of view.</span><h2>Good things<br /><em>work together.</em></h2>
        <div className="ecosystem-map" aria-hidden="true"><svg viewBox="0 0 500 450" fill="none"><circle cx="250" cy="225" r="180" stroke="#b7bd9e" strokeDasharray="2 8" /><path d="M250 35v380M40 225h420" stroke="#d7dbca" /><g strokeWidth="2"><path className="ecosystem-path-0" d="M250 225V85" stroke="#8e75ac" /><path className="ecosystem-path-1" d="M250 225h-95v115" stroke="#6b8050" /><path className="ecosystem-path-2" d="M250 225h95v115" stroke="#b18b30" /></g><g className="ecosystem-cluster-0"><rect x="178" y="40" width="144" height="82" fill="#e2d9ed" /><circle cx="250" cy="69" r="13" stroke="#78618f" /><path d="M232 69h36m-18-18v36" stroke="#78618f" /><text x="250" y="105">INTELLIGENCE</text></g><g className="ecosystem-cluster-1"><rect x="72" y="315" width="166" height="82" fill="#dce6c9" /><path d="M136 332h16v16h-16zm22 0h16v16h-16zm-22 22h16v16h-16zm22 0h16v16h-16z" fill="#6b8050" /><text x="155" y="384">OPERATIONS</text></g><g className="ecosystem-cluster-2"><rect x="264" y="315" width="166" height="82" fill="#f0df9a" /><path d="M326 365v-12h10v12m5 0v-22h10v22m5 0v-32h10v32" fill="#9c7926" /><text x="347" y="384">POSSIBILITY</text></g><circle cx="250" cy="225" r="40" fill="#f7f5ed" stroke="#b7bd9e" /></svg><PixelA monochrome /></div>
        <div className="ecosystem-position"><span className="mono">THE CONNECTION / 0{active+1}</span><span className="ecosystem-dots" aria-hidden="true">{chapters.map((_,i)=><i key={i} className={active >= i?'is-lit':''}/>)}</span></div>
      </div>
      <div className="ecosystem-chapters">{chapters.map((chapter,i)=><article className="ecosystem-chapter" key={chapter.title} data-chapter={i}><span className="mono">0{i+1} / {['INTELLIGENCE','OPERATIONS','POSSIBILITY'][i]}</span><h3>{chapter.title}<br /><em>{chapter.accent}</em></h3><p>{chapter.copy}</p><span className="ecosystem-products">{chapter.names}</span><Link to={chapter.to} className="design-inline-link">{chapter.label}<ArrowUpRight size={18}/></Link></article>)}</div>
    </div>
  </section>;
}
