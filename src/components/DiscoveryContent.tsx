import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { companyAnswers, servicePages } from '../data/discovery';

export function ServiceLinks() {
  return <section className="discovery-services container" aria-labelledby="service-guides-title">
    <div className="design-section-heading"><div><span className="design-kicker mono">Development services</span><h2 id="service-guides-title">Software that fits<br /><em>the way you work.</em></h2></div><p>Explore what goes into a website, a custom application or a connected ERP system.</p></div>
    <div className="discovery-service-grid">{servicePages.map((service, index) => <Link key={service.slug} to={`/services/${service.slug}`}><span className="mono">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><span className="discovery-card-link">Explore the approach<ArrowUpRight size={19} /></span></Link>)}</div>
  </section>;
}

export function Questions({ items = companyAnswers }: { items?: readonly (readonly [string, string])[] }) {
  return <section className="discovery-questions container" aria-labelledby="questions-title"><div><span className="design-kicker mono">Before we begin</span><h2 id="questions-title">Frequently asked<br /><em>questions.</em></h2><Link to="/contact" className="design-inline-link">Talk about your project<ArrowUpRight size={18} /></Link></div><div>{items.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>;
}
