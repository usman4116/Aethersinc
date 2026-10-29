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
import ServiceDetail from './pages/ServiceDetail';
import Founder from './pages/Founder';
import { applySeo } from './seo';
import { MotionExperience } from './motion/MotionExperience';
import { PageStory } from './motion/PageStory';
import { scrollToTarget } from './motion/scroll';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    applySeo(pathname);
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
  return <><Header /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:slug" element={<ProductDetail />} /><Route path="/services" element={<Services />} /><Route path="/services/:slug" element={<ServiceDetail />} /><Route path="/projects" element={<Projects />} /><Route path="/about" element={<About />} /><Route path="/about/usman-farhan" element={<Founder />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><MotionExperience /><PageStory /><RouteEffects /></>;
}
