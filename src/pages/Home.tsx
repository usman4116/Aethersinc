import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Minus, Plus } from 'lucide-react';
import { PixelA } from '../components/Brand';
import { HeroVisual } from '../components/HeroVisual';
import { Button, ContactCta, Eyebrow, Reveal, TextLink } from '../components/UI';
import { Process } from '../components/Process';
import { services, technologies } from '../data/content';
import { ProductStory } from '../components/ProductStory';
import { HorizontalWork } from '../components/HorizontalWork';
import { scrollToTarget } from '../motion/scroll';

export default function Home() {
  const [activeService, setActiveService] = useState<number | null>(0);
  return <>
    <section className="home-hero"><div className="container hero-layout"><div className="hero-content"><Eyebrow>Independent thinking. Intelligent software.</Eyebrow><h1 className="motion-title" aria-label="Intelligent software. In your hands."><span className="hero-line"><span>Intelligent</span></span><span className="hero-line"><span>software.</span></span><span className="hero-line"><span>In your hands.</span></span></h1><p>AI platforms, business software and digital experiences. Built around the way you work. Ready for what’s next.</p><div className="hero-actions"><Button to="/products">Explore our products</Button><Button to="/contact" variant="outline">Build with us</Button></div></div><HeroVisual /></div><div className="container hero-meta mono"><span>SOFTWARE WITH PURPOSE.</span><a href="#possibilities" onClick={event => { event.preventDefault(); scrollToTarget('#possibilities'); }}>EXPLORE THE ECOSYSTEM<ArrowDown size={13} /></a><span>INDEPENDENT SINCE 2023</span></div></section>
    <div className="discipline-band"><div className="container"><span className="mono">One connected ecosystem</span><div><span>Artificial intelligence</span><i /><span>Enterprise software</span><i /><span>Digital experiences</span></div><PixelA /></div></div>
    <ProductStory />
    <section className="statement-section"><div className="container"><Eyebrow>Your business is one of a kind</Eyebrow><Reveal><h2><span className="scroll-word">Your</span> <span className="scroll-word">software</span><br /><span className="scroll-word">should</span> <span className="scroll-word">be,</span> <span className="scroll-word statement-accent">too.</span></h2></Reveal><div className="statement-bottom"><PixelA monochrome /><p>Every organisation is different. We engineer solutions that match your processes, your goals, and the way you want to grow.</p><TextLink to="/about">Discover our approach</TextLink></div></div></section>
    <section className="section services-section"><div className="container services-split"><Reveal className="services-intro"><Eyebrow>Made for your next move</Eyebrow><h2>From ambition<br />to <span className="text-orange">action.</span></h2><p>One team. Six disciplines. The expertise to take your next idea from a conversation to working software.</p><TextLink to="/services">Explore our solutions</TextLink><div className="service-pixel-visual" aria-hidden="true"><div className="pixel-stair stair-one" /><div className="pixel-stair stair-two" /><PixelA monochrome /><span className="mono">THINK. BUILD. CONNECT.</span></div></Reveal><div className="service-accordion">{services.map((service, index) => <div key={service.slug} className={`accordion-item ${activeService === index ? 'accordion-open' : ''}`}><h3><button type="button" aria-expanded={activeService === index} aria-controls={`service-panel-${index}`} onClick={() => setActiveService(activeService === index ? null : index)}><span className="mono accordion-number">0{index + 1}</span><span>{service.title}</span>{activeService === index ? <Minus size={20} /> : <Plus size={20} />}</button></h3><div id={`service-panel-${index}`} hidden={activeService !== index} className="accordion-content"><p>{service.description}</p><TextLink to={`/services#${service.slug}`}>See what we can build</TextLink></div></div>)}</div></div></section>
    <HorizontalWork />
    <section className="futurepath-section"><div className="container futurepath-inner"><div><Eyebrow>A clearer view of what comes next</Eyebrow><h2>See the possibilities.<br /><span>Choose your path.</span></h2><p>FuturePath AI models the financial and personal impact of major decisions, with risk and confidence estimates to help you see the path ahead.</p><Button to="/products/futurepath-ai" variant="light">Discover FuturePath AI</Button><span className="futurepath-status mono"><i />A LIVE AETHERSYNC PLATFORM</span></div><Link className="futurepath-image" to="/products/futurepath-ai" aria-label="Discover FuturePath AI"><div className="browser-bar"><span /><span /><span /><span className="browser-label mono">FUTUREPATH AI</span><ArrowUpRight size={14} /></div><img src="/projects/futurepath.jpg" width="1200" height="900" alt="FuturePath AI decision intelligence website" loading="lazy" /></Link></div></section>
    <Process />
    <section className="tech-section"><div className="container"><span className="mono">A modern foundation</span><div className="tech-marquee"><div className="tech-list">{technologies.map(tech => <span key={tech}>{tech}</span>)}{technologies.map(tech => <span key={"copy-" + tech} aria-hidden="true">{tech}</span>)}</div></div></div></section>
    <ContactCta />
  </>;
}
