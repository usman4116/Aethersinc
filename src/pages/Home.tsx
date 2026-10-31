import { Questions, ServiceLinks } from '../components/DiscoveryContent';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
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
    <ServiceLinks />
    <ProductStory />
    <section className="section services-section"><div className="container services-split"><Reveal className="services-intro"><Eyebrow>Our capabilities</Eyebrow><h2>The expertise behind<br />your next release.</h2><p>Development, integration and ongoing support from one team. Choose the capabilities your project needs.</p><TextLink to="/services">Explore our solutions</TextLink></Reveal><div className="service-accordion">{services.map((service, index) => <div key={service.slug} className={`accordion-item ${activeService === index ? 'accordion-open' : ''}`}><h3><button type="button" aria-expanded={activeService === index} aria-controls={`service-panel-${index}`} onClick={() => setActiveService(activeService === index ? null : index)}><span className="mono accordion-number">0{index + 1}</span><span>{service.title}</span>{activeService === index ? <Minus size={20} /> : <Plus size={20} />}</button></h3><div id={`service-panel-${index}`} hidden={activeService !== index} className="accordion-content"><p>{service.description}</p><TextLink to={`/services#${service.slug}`}>See what we can build</TextLink></div></div>)}</div></div></section>
    <HorizontalWork />
    <IdeFeature />
    <Process />
    <section className="tech-section"><div className="container"><span className="mono">A modern foundation</span><div className="tech-marquee"><div className="tech-list">{technologies.map(tech => <span key={tech}>{tech}</span>)}{technologies.map(tech => <span key={"copy-" + tech} aria-hidden="true">{tech}</span>)}</div></div></div></section>
    <Questions /><ContactCta />
  </>;
}
