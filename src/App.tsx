import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Products, { ProductDetail } from './pages/Products';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { products, services } from './data/content';
import { clientProjects } from './data/projects';
import { MotionExperience } from './motion/MotionExperience';
import { scrollToTarget } from './motion/scroll';

const pageMeta: Record<string, [string, string]> = {
  '/': ['Aethersync — Intelligent software. In your hands.', 'Aethersync builds intelligent AI platforms, enterprise ERP, custom software and distinctive websites. Built around your business, since 2023.'],
  '/products': ['Our products — Aethersync', 'Purple AI, Open ERP, Corpflow, Finraze, Fact Checking, Laundry Management and FuturePath AI. Seven intelligent platforms, four live today.'],
  '/services': ['Software, AI & ERP solutions — Aethersync', 'Custom software, AI development, enterprise ERP, web and mobile apps, cloud and DevOps, API integration and business automation.'],
  '/projects': ['Selected client work — Aethersync', 'Explore Acrylica, Lumea Skin Care, Rexo Perfume, Coffee Shop, Studio Shodwe, Larana Parlour and Watches. Seven distinctive client websites.'],
  '/about': ['About us — Aethersync', 'A technology company established in 2023. Meet Muhammad Usman Farhan and Muhammad Abdullah Bhatti, the founders of Aethersync.'],
  '/contact': ['Let’s talk — Aethersync', 'Start a conversation about your next software project, AI platform or business system. Contact ceo@theaethersync.com.'],
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const product = products.find(p => `/products/${p.slug}` === pathname);
    const [title, description] = product ? [`${product.name} — Aethersync`, product.description] : pageMeta[pathname] || ['Page not found — Aethersync', 'Find your way back to Aethersync.'];
    document.title = title;
    for (const [selector, value] of [['meta[name="description"]', description], ['meta[property="og:title"]', title], ['meta[property="og:description"]', description], ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', description], ['meta[property="og:url"]', `https://theaethersync.com${pathname}`]]) document.querySelector(selector)?.setAttribute('content', value);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://theaethersync.com${pathname}`);
    const schema = document.createElement('script');
    schema.type = 'application/ld+json'; schema.id = 'page-schema';
    const base = { '@context': 'https://schema.org', url: `https://theaethersync.com${pathname}`, name: title };
    const software = (p: typeof products[number]) => ({ '@type': 'SoftwareApplication', name: p.name, description: p.description, applicationCategory: p.category, operatingSystem: 'Web', publisher: { '@type': 'Organization', name: 'Aethersync' }, ...(p.url ? { url: p.url } : {}) });
    const data = product ? { ...base, ...software(product) } : pathname === '/products' ? { ...base, '@type': 'CollectionPage', hasPart: products.map(software) } : pathname === '/services' ? { ...base, '@type': 'CollectionPage', hasPart: services.map(s => ({ '@type': 'Service', name: s.fullTitle, description: s.description, provider: { '@type': 'Organization', name: 'Aethersync' } })) } : pathname === '/projects' ? { ...base, '@type': 'CollectionPage', hasPart: clientProjects.map(p => ({ '@type': 'CreativeWork', name: p.name, description: p.description, url: p.url })) } : { ...base, '@type': pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage' };
    schema.textContent = JSON.stringify(data); document.head.appendChild(schema);
    return () => schema.remove();
  }, [pathname]);
  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => scrollToTarget('#' + hash.slice(1), true));
      return () => cancelAnimationFrame(frame);
    }
    scrollToTarget(0, true);
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return <><Header /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:slug" element={<ProductDetail />} /><Route path="/services" element={<Services />} /><Route path="/projects" element={<Projects />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><MotionExperience /><RouteEffects /></>;
}
