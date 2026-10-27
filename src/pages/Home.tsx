import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { PixelA } from '../components/Brand';
import { MistralHero } from '../components/MistralHero';
import { ContactCta, Eyebrow, Reveal, TextLink } from '../components/UI';
import { Process } from '../components/Process';
import { services, technologies } from '../data/content';
import { ProductStory } from '../components/ProductStory';
import { HorizontalWork } from '../components/HorizontalWork';
import { IdeFeature } from '../components/IdeFeature';

export default function Home() {
  const [activeService, setActiveService] = useState<number | null>(0);
  return <>
    <MistralHero />
    <ProductStory />
    <section className="statement-section"><div className="container"><Eyebrow>Your business is one of a kind</Eyebrow><Reveal><h2><span className="scroll-word">Your</span> <span className="scroll-word">software</span><br /><span className="scroll-word">should</span> <span className="scroll-word">be,</span> <span className="scroll-word statement-accent">too.</span></h2></Reveal><div className="statement-bottom"><PixelA monochrome /><p>Every organisation is different. We engineer solutions that match your processes, your goals, and the way you want to grow.</p><TextLink to="/about">Discover our approach</TextLink></div></div></section>
    <section className="section services-section"><div className="container services-split"><Reveal className="services-intro"><Eyebrow>Made for your next move</Eyebrow><h2>From ambition<br />to <span className="text-orange">action.</span></h2><p>One team. Six disciplines. The expertise to take your next idea from a conversation to working software.</p><TextLink to="/services">Explore our solutions</TextLink><div className="service-pixel-visual" aria-hidden="true"><div className="pixel-stair stair-one" /><div className="pixel-stair stair-two" /><PixelA monochrome /><span className="mono">THINK. BUILD. CONNECT.</span></div></Reveal><div className="service-accordion">{services.map((service, index) => <div key={service.slug} className={`accordion-item ${activeService === index ? 'accordion-open' : ''}`}><h3><button type="button" aria-expanded={activeService === index} aria-controls={`service-panel-${index}`} onClick={() => setActiveService(activeService === index ? null : index)}><span className="mono accordion-number">0{index + 1}</span><span>{service.title}</span>{activeService === index ? <Minus size={20} /> : <Plus size={20} />}</button></h3><div id={`service-panel-${index}`} hidden={activeService !== index} className="accordion-content"><p>{service.description}</p><TextLink to={`/services#${service.slug}`}>See what we can build</TextLink></div></div>)}</div></div></section>
    <HorizontalWork />
    <IdeFeature />
    <Process />
    <section className="tech-section"><div className="container"><span className="mono">A modern foundation</span><div className="tech-marquee"><div className="tech-list">{technologies.map(tech => <span key={tech}>{tech}</span>)}{technologies.map(tech => <span key={"copy-" + tech} aria-hidden="true">{tech}</span>)}</div></div></div></section>
    <ContactCta />
  </>;
}
