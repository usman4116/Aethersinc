import { useId, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { process } from '../data/content';
import { Eyebrow } from './UI';

export function Process() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const active = process[selected];
  return <section className="process-section section" id="process"><div className="container"><div className="section-heading"><div><Eyebrow>How we make it happen</Eyebrow><h2>Good ideas deserve<br />a clear path forward.</h2></div><p>From the first conversation to the next release, we keep you close to the work.</p></div><div className="process-layout"><div className="process-tabs" role="tablist" aria-label="Development process" aria-orientation="vertical">{process.map((step, index) => <button key={step.title} id={`${id}-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls={`${id}-panel`} tabIndex={selected === index ? 0 : -1} type="button" onClick={() => setSelected(index)} onKeyDown={e => { let next = index; if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % process.length; else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index + process.length - 1) % process.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = process.length - 1; else return; e.preventDefault(); setSelected(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }}><span className="mono">0{index + 1}</span>{step.title}<ArrowRight size={17} /></button>)}</div><div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} className="process-panel grid-paper"><span className="process-big-number" aria-hidden="true">0{selected + 1}</span><div className="process-panel-content" key={selected}><span className="mono">STEP 0{selected + 1} / 07</span><h3>{active.title}</h3><p>{active.description}</p><ul>{active.deliverables.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></div></div></div></div></section>;
}
