import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { companyAnswers, servicePages } from '../data/discovery';

export function ServiceLinks() {
  return <section className="discovery-services container" aria-labelledby="service-guides-title">
    <div className="design-section-heading"><div><span className="design-kicker mono">Built around your business</span><h2 id="service-guides-title">Websites. Software.<br /><em>Built around you.</em></h2></div><p>Explore what goes into a website, a custom application or a connected ERP system.</p></div>
    <div className="discovery-service-grid">{servicePages.map((service, index) => <Link key={service.slug} to={`/services/${service.slug}`}><span className="mono">0{index + 1} / EXPLORE THE SERVICE</span><h3>{service.title}</h3><p>{service.description}</p><span className="discovery-card-link">Explore the approach<ArrowUpRight size={19} /></span></Link>)}</div>
  </section>;
}

export function Questions({ items = companyAnswers }: { items?: readonly (readonly [string, string])[] }) {
  return <section className="discovery-questions container" aria-labelledby="questions-title"><div><span className="design-kicker mono">A little more clarity</span><h2 id="questions-title">Good questions.<br /><em>Clear answers.</em></h2><Link to="/contact" className="design-inline-link">Talk about your project<ArrowUpRight size={18} /></Link></div><div>{items.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>;
}
