import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { Brand, PixelA } from './Brand';
import { products, services } from '../data/content';

const menus = [
  { name: 'Products', introduction: 'Intelligent tools. Real possibilities.', description: 'Explore the platforms we build to make work flow.', links: products.map(p => ({ label: p.name, description: p.category, href: `/products/${p.slug}` })), all: '/products', allLabel: 'Explore all products' },
  { name: 'Solutions', introduction: 'Built around your business.', description: 'From the first idea to the next stage of growth.', links: services.map(s => ({ label: s.title, description: s.fullTitle, href: `/services#${s.slug}` })), all: '/services', allLabel: 'Explore our services' },
  { name: 'Company', introduction: 'Independent minds. Shared ambition.', description: 'Meet the people and the thinking behind Aethersync.', links: [{ label: 'About Aethersync', description: 'Our story and our founders', href: '/about' }, { label: 'Our process', description: 'How we turn ideas into software', href: '/services#process' }, { label: 'Get in touch', description: 'Start a conversation', href: '/contact' }], all: '/about', allLabel: 'Meet Aethersync' },
];

export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const location = useLocation();
  useEffect(() => { setActive(null); setMobileOpen(false); }, [location]);
  useEffect(() => {
    const click = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setActive(null); };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (active) triggerRefs.current[active]?.focus();
        if (mobileOpen) document.getElementById('mobile-menu-trigger')?.focus();
        setActive(null); setMobileOpen(false);
      }
    };
    document.addEventListener('pointerdown', click); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', click); document.removeEventListener('keydown', key); };
  }, [active, mobileOpen]);
  useEffect(() => {
    if (!mobileOpen) return;
    const media = window.matchMedia('(min-width: 961px)');
    const closeOnDesktop = () => { if (media.matches) setMobileOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, [mobileOpen]);

  const current = menus.find(m => m.name === active);
  return <header className="site-header" ref={ref} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null); }}>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); document.getElementById('main')?.scrollIntoView(); }}>Skip to content</a>
    <div className="header-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation">
      {menus.map(menu => <button key={menu.name} ref={el => { triggerRefs.current[menu.name] = el; }} className={`nav-trigger ${active === menu.name ? 'is-active' : ''}`} type="button" onClick={() => setActive(active === menu.name ? null : menu.name)} aria-expanded={active === menu.name} aria-controls="nav-dropdown">{menu.name}<ChevronDown size={13} aria-hidden="true" /></button>)}
      <Link to="/projects" className={location.pathname === '/projects' ? 'nav-link is-active' : 'nav-link'}>Our work</Link>
    </nav><Link to="/contact" className="header-cta">Let’s talk<ArrowUpRight size={16} aria-hidden="true" /></Link><button id="mobile-menu-trigger" className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-nav">{mobileOpen ? <X /> : <Menu />}</button></div>
    {current && <div id="nav-dropdown" className="nav-dropdown"><div className="container dropdown-inner"><div className="dropdown-intro"><PixelA /><h2>{current.introduction}</h2><p>{current.description}</p><Link to={current.all} className="text-link">{current.allLabel}<ArrowUpRight size={17} /></Link></div><div className="dropdown-links">{current.links.map(link => <Link key={link.href} to={link.href}><strong>{link.label}</strong><span>{link.description}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div></div></div>}
    {mobileOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><Link to="/products">Products<ArrowUpRight /></Link><Link to="/services">Solutions<ArrowUpRight /></Link><Link to="/projects">Our work<ArrowUpRight /></Link><Link to="/about">Company<ArrowUpRight /></Link><Link to="/contact">Let’s talk<ArrowUpRight /></Link><p className="mono">Intelligent software. In your hands.</p></nav>}
  </header>;
}
