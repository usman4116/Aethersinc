import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PixelA } from './Brand';

export function Button({ children, to, href, variant = 'dark', className = '' }: { children: ReactNode; to?: string; href?: string; variant?: 'dark' | 'outline' | 'orange' | 'light'; className?: string }) {
  const cls = `button button-${variant} ${className}`;
  const inner = <>{children}<ArrowUpRight size={17} aria-hidden="true" /></>;
  return to ? <Link className={cls} to={to}>{inner}</Link> : <a className={cls} href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{inner}</a>;
}

export function TextLink({ children, to, href }: { children: ReactNode; to?: string; href?: string }) {
  const inner = <>{children}<ArrowRight size={18} aria-hidden="true" /></>;
  return to ? <Link className="text-link" to={to}>{inner}</Link> : <a className="text-link" href={href}>{inner}</a>;
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow mono ${className}`}><span aria-hidden="true" />{children}</p>;
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); }
    }, { threshold: 0.06 });
    el.classList.add('reveal-ready');
    observer.observe(el);
    return () => { observer.disconnect(); el.classList.remove('reveal-ready'); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode }) {
  return <section className="page-hero grid-paper"><div className="container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><div className="page-hero-bottom"><p className="lede">{description}</p>{children || <PixelA />}</div></div></section>;
}

export function ContactCta() {
  return <section className="contact-cta"><div className="container cta-inner"><div><Eyebrow>Built together. Built to last.</Eyebrow><h2>Your next big idea.<br /><span>Let’s make it real.</span></h2></div><Button to="/contact" variant="dark">Talk to our team</Button><PixelA className="cta-mark" monochrome /></div></section>;
}
