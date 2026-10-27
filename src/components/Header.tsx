import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Brand, PixelA } from './Brand';
import { products, services } from '../data/content';

const menus = [
  { name: 'Products', links: products.map(p => ({ label: p.name, description: p.category, href: `/products/${p.slug}` })), all: '/products', allLabel: 'Explore all products' },
  { name: 'Solutions', links: services.map(s => ({ label: s.title, description: s.fullTitle, href: `/services#${s.slug}` })), all: '/services', allLabel: 'Explore our services' },
  { name: 'Company', links: [{ label: 'About Aethersync', description: 'Our story and our founders', href: '/about' }, { label: 'Our process', description: 'How we turn ideas into software', href: '/services#process' }, { label: 'Get in touch', description: 'Start a conversation', href: '/contact' }], all: '/about', allLabel: 'Meet Aethersync' },
];

export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const location = useLocation();
  useEffect(() => { setActive(null); setMobileOpen(false); setMobileSection(null); }, [location]);
  useEffect(() => {
    const click = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setActive(null); };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (active) triggerRefs.current[active]?.focus();
        if (mobileOpen) document.getElementById('mobile-menu-trigger')?.focus();
        setActive(null); setMobileOpen(false); setMobileSection(null);
      }
      if (e.key === 'Tab' && mobileOpen) {
        const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href], button') || []).filter(el => el.getClientRects().length && !el.closest('[inert]'));
        const first = elements[0], last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('pointerdown', click); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', click); document.removeEventListener('keydown', key); };
  }, [active, mobileOpen]);
  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    main?.setAttribute('inert', ''); footer?.setAttribute('inert', '');
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (media.matches) setMobileOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => { document.body.style.overflow = originalOverflow; main?.removeAttribute('inert'); footer?.removeAttribute('inert'); media.removeEventListener('change', closeOnDesktop); };
  }, [mobileOpen]);

  const dropdown = (name: string, menu: typeof menus[number], compact = false) => active === name && <div id={`nav-dropdown-${name.toLowerCase()}`} className={`nav-dropdown ${compact ? 'nav-dropdown-compact' : ''}`}>
    <div className="dropdown-links">{menu.links.map(link => <Link key={link.href} to={link.href}><strong>{link.label}</strong><span>{link.description}</span><ChevronRight size={15} aria-hidden="true" /></Link>)}</div>
    <Link to={menu.all} className="dropdown-all">{menu.allLabel}<ArrowRight size={16} aria-hidden="true" /></Link>
  </div>;
  const mobileMenu = menus.find(menu => menu.name === mobileSection);

  return <header className={`site-header mistral-header ${mobileOpen ? 'mobile-is-open' : ''}`} ref={ref} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null); }}>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); document.getElementById('main')?.scrollIntoView(); }}>Skip to content</a>
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {menus.slice(0, 2).map(menu => <div className="nav-cell" key={menu.name}>
          <button ref={el => { triggerRefs.current[menu.name] = el; }} className={`nav-trigger ${active === menu.name ? 'is-active' : ''}`} type="button" onClick={() => setActive(active === menu.name ? null : menu.name)} aria-expanded={active === menu.name} aria-controls={`nav-dropdown-${menu.name.toLowerCase()}`}>{menu.name}</button>
          {dropdown(menu.name, menu)}
        </div>)}
        <Link to="/projects" className={location.pathname === '/projects' ? 'nav-link is-active' : 'nav-link'}>Our work</Link>
        <div className="nav-cell"><button ref={el => { triggerRefs.current.Company = el; }} className={`nav-trigger ${active === 'Company' ? 'is-active' : ''}`} onClick={() => setActive(active === 'Company' ? null : 'Company')} type="button" aria-expanded={active === 'Company'} aria-controls="nav-dropdown-company">Company</button>{dropdown('Company', menus[2])}</div>
      </nav>
      <Link to="/contact" className="header-contact">Get in touch<ChevronRight size={17} aria-hidden="true" /></Link>
      <div className="nav-cell header-explore"><button ref={el => { triggerRefs.current.Explore = el; }} type="button" className="header-cta" onClick={() => setActive(active === 'Explore' ? null : 'Explore')} aria-expanded={active === 'Explore'} aria-controls="nav-dropdown-explore">Explore<ChevronDown size={17} aria-hidden="true" /></button>{dropdown('Explore', menus[0], true)}</div>
      <button id="mobile-menu-trigger" className="menu-toggle" onClick={() => { setMobileOpen(!mobileOpen); setMobileSection(null); }} type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-nav">{mobileOpen ? <X size={20} /> : <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{[3, 8, 13].flatMap(x => [3, 8, 13].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" />))}</svg>}</button>
    </div>
    <nav id="mobile-nav" className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!mobileOpen} {...(!mobileOpen ? { inert: '' } : {})}>
      {mobileOpen && <div className="mobile-nav-content" key={mobileSection || 'main'}>
        {mobileMenu ? <><button className="mobile-back" type="button" onClick={() => setMobileSection(null)}><ArrowRight size={17} />All navigation</button><p className="mobile-nav-label">{mobileMenu.name}</p>{mobileMenu.links.map(link => <Link key={link.href} to={link.href}>{link.label}<ChevronRight size={19} /></Link>)}<Link className="mobile-all" to={mobileMenu.all}>{mobileMenu.allLabel}<ArrowUpRight size={19} /></Link></> : <>{menus.slice(0, 2).map(menu => <button key={menu.name} type="button" onClick={() => setMobileSection(menu.name)}>{menu.name}<ChevronRight size={20} /></button>)}<Link to="/projects">Our work<ChevronRight size={20} /></Link><button type="button" onClick={() => setMobileSection('Company')}>Company<ChevronRight size={20} /></button><Link to="/contact">Get in touch<ArrowUpRight size={20} /></Link><div className="mobile-nav-brand"><PixelA /><p>Intelligent software.<br />In your hands.</p></div></>}
      </div>}
    </nav>
  </header>;
}
