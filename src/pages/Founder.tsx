import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DesignPage, PageEnd, TitleLine } from '../components/DesignPage';
import { Questions } from '../components/DiscoveryContent';
import { COMPANY_NAME } from '../data/discovery';

export default function Founder() {
  return <DesignPage className="founder-profile-design">
    <section className="discovery-intro founder-profile-intro container">
      <nav className="discovery-breadcrumb mono" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/about">Company</Link><span>/</span><span aria-current="page">Usman Farhan</span></nav>
      <div className="founder-profile-grid"><div><span className="design-kicker mono">CEO & Founder / {COMPANY_NAME}</span><h1><TitleLine>Muhammad</TitleLine><TitleLine><em>Usman Farhan.</em></TitleLine></h1><p>Muhammad Usman Farhan, also known as Usman Farhan, is the CEO and founder of Aethersync Technology Solutions.</p><p>His work focuses on enterprise ERP systems, custom software architectures and AI-driven business automation.</p><Link to="/contact" className="design-button">Connect with Aethersync<ArrowUpRight size={19} /></Link></div><figure><img src="/founder.jpg" alt="Muhammad Usman Farhan, CEO and founder of Aethersync Technology Solutions" width="800" height="1000" /><figcaption className="mono">THE PERSON BEHIND THE PURPOSE</figcaption></figure></div>
    </section>
    <section className="discovery-delivery container" data-reveal><div><span className="design-kicker mono">BUILDING WITH PURPOSE</span><h2>From platforms<br /><em>to possibilities.</em></h2></div><div><p>Aethersync was established in 2023. The company began by building its own software platforms, then expanded into development services shaped by that practical product experience.</p><p>Today, Aethersync’s work spans website development, custom software, ERP customization, AI applications, cloud infrastructure and business automation. Usman Farhan leads the company as CEO and founder.</p><Link to="/about" className="design-inline-link">Read the company story<ArrowUpRight size={18} /></Link></div></section>
    <section className="discovery-proof container" data-reveal><span className="design-kicker mono">THE WORK BEHIND THE WORDS</span><p>Explore the Aethersync platforms and client websites to learn more about what the company builds.</p><div className="discovery-related"><Link to="/products">Software platforms<ArrowUpRight size={18} /></Link><Link to="/projects">Client website work<ArrowUpRight size={18} /></Link></div></section>
    <Questions />
    <PageEnd>Good things start<br /><em>with a conversation.</em></PageEnd>
  </DesignPage>;
}
