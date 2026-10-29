import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DesignPage, PageEnd, TitleLine } from '../components/DesignPage';
import { InteriorHeroFrame } from '../components/InteriorHeroFrame';
import { Questions } from '../components/DiscoveryContent';
import { servicePages } from '../data/discovery';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = servicePages.find(item => item.slug === slug);
  if (!service) return <NotFound />;
  return <DesignPage className="service-detail-design">
    <section className="discovery-intro container premium-interior-hero"><InteriorHeroFrame variant="solutions" />
      <nav className="discovery-breadcrumb mono" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/services">Services</Link><span>/</span><span aria-current="page">{service.title}</span></nav>
      <span className="design-kicker mono">{service.title}</span><h1><TitleLine>{service.headline}</TitleLine><TitleLine><em>{service.accent}</em></TitleLine></h1>
      <div className="discovery-intro-bottom" data-reveal><p>{service.introduction}</p><Link to={`/contact?interest=${encodeURIComponent(service.title)}`} className="design-button">Discuss your project<ArrowUpRight size={19} /></Link></div>
    </section>
    <section className="discovery-fit container"><span className="design-kicker mono">01 / THE STARTING POINT</span><div data-reveal><h2>Made for your<br /><em>next chapter.</em></h2><p>{service.fit}</p></div></section>
    <section className="discovery-outcomes container" aria-label="What the service includes">{service.outcomes.map(([title, copy], index) => <article key={title} data-reveal><span className="mono">0{index + 1} / THE FOUNDATION</span><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="discovery-delivery container" data-reveal><div><span className="design-kicker mono">02 / FROM IDEA TO DELIVERY</span><h2>Considered at<br /><em>every step.</em></h2><Link to="/services#process" className="design-inline-link">See our delivery process<ArrowUpRight size={18} /></Link></div><p>{service.delivery}</p></section>
    <section className="discovery-proof container" data-reveal><span className="design-kicker mono">03 / EXPLORE THE WORK</span><p>{service.proof}</p><Link to={service.proofPath} className="design-inline-link">{service.proofLabel}<ArrowUpRight size={18} /></Link></section>
    <Questions items={service.faqs} />
    <nav className="discovery-related container" aria-label="Related services">{servicePages.filter(item => item.slug !== service.slug).map(item => <Link key={item.slug} to={`/services/${item.slug}`}>{item.title}<ArrowUpRight size={18} /></Link>)}</nav>
    <PageEnd>Your next idea.<br /><em>Let’s build it.</em></PageEnd>
  </DesignPage>;
}
