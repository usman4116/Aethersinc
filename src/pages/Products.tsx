import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import { products, type Product } from '../data/content';
import { Status } from '../components/ProductCard';
import { Button } from '../components/UI';
import { DesignPage, PageEnd, PageScrollLink, TitleLine } from '../components/DesignPage';
import { PlatformGlyph } from '../components/DesignArt';
import NotFound from './NotFound';
import { ProductJourney } from '../components/ProductJourney';

const filters = ['All platforms', 'Artificial intelligence', 'Business operations', 'Finance'] as const;
const initials = ['PA', 'OE', 'CF', 'FR', 'FC', 'LM', 'FP'];

function PlatformTile({ product, index }: { product: Product; index: number }) {
  return <article className="platform-tile" data-color={product.color}>
    <Link className="platform-tile-art" to={`/products/${product.slug}`} aria-label={`Explore ${product.name}`}><span className="platform-tile-index mono">A / {String(index + 1).padStart(2, '0')}</span><PlatformGlyph color={product.color} /><span className="platform-tile-launch"><ArrowUpRight size={23} /></span></Link>
    <div className="platform-tile-copy"><div className="platform-tile-meta"><span className="mono">{product.category}</span><Status status={product.status} /></div><h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3><p>{product.description}</p><Link className="platform-tile-link" to={`/products/${product.slug}`}>Discover the platform<ArrowRight size={17} /></Link></div>
  </article>;
}

export default function Products() {
  const [filter, setFilter] = useState<string>('All platforms');
  const [selected, setSelected] = useState(0);
  const active = products[selected];
  const filtered = products.filter(p => filter === 'All platforms' || (filter === 'Artificial intelligence' && p.category.startsWith('AI')) || (filter === 'Finance' && p.slug === 'finraze') || (filter === 'Business operations' && ['open-erp', 'corpflow', 'laundry-management'].includes(p.slug)));
  return <DesignPage className="products-design">
    <section className="products-intro"><div className="container products-intro-grid"><div className="products-intro-copy"><div className="design-kicker mono"><span />The Aethersync ecosystem / 01</div><h1><TitleLine>Big ideas.</TitleLine><TitleLine>Useful tools.</TitleLine><TitleLine className="product-title-accent">Yours to build.</TitleLine></h1><p data-reveal>Intelligent platforms for the way you work.<br />Built with purpose. Connected by design.</p><PageScrollLink target="#platforms">Find your platform</PageScrollLink><div className="products-intro-stats" data-reveal><div><strong>07<span>↗</span></strong><span className="mono">Owned platforms</span></div><div><strong>04<span>●</span></strong><span className="mono">Live today</span></div></div></div>
      <div className="product-console" data-reveal data-tilt><div className="console-heading mono"><span><i />ECOSYSTEM EXPLORER</span><span>{String(selected + 1).padStart(2, '0')} / 07</span></div><div className="console-stage" key={active.slug}><PlatformGlyph color={active.color} /><span className="console-coordinate mono">INTELLIGENCE, IN GOOD COMPANY.</span></div><div className="console-active"><div><span className="mono">{active.category}</span><h2>{active.name}</h2></div><Link to={`/products/${active.slug}`} aria-label={`Explore ${active.name}`}><ArrowUpRight size={26} /></Link></div><div className="console-selector" role="group" aria-label="Explore product ecosystem">{products.map((p,i) => <button type="button" key={p.slug} aria-label={`Preview ${p.name}`} aria-pressed={selected === i} onClick={() => setSelected(i)} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(i); }} onFocus={() => setSelected(i)}>{initials[i]}</button>)}</div></div>
    </div></section>
    <div className="product-principles"><div className="container"><span className="mono">One connected point of view</span><span>Intelligence<Plus size={17} />Operations<Plus size={17} />Possibility<ArrowUpRight size={19} /></span></div></div>
    <ProductJourney />
    <section className="platform-catalog container" id="platforms"><div className="design-section-heading" data-reveal><div><span className="design-kicker mono">Meet your next advantage</span><h2>A place for every<br /><em>possibility.</em></h2></div><p>From your first question to your next big move.<br />Explore the software we’re building.</p></div><div className="design-filter-bar"><div className="design-filters" role="group" aria-label="Filter products">{filters.map(item => <button type="button" key={item} aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="mono" aria-live="polite">{String(filtered.length).padStart(2, '0')} PLATFORMS</span></div><div className={`platform-grid ${filter !== 'All platforms' ? 'platform-grid-filtered' : ''}`}>{filtered.map(product => <PlatformTile key={product.slug} product={product} index={products.indexOf(product)} />)}</div></section>
    <section className="product-bespoke container" data-reveal><span className="bespoke-symbol" aria-hidden="true">↗</span><div><span className="mono">Made to measure</span><h2>A different challenge?<br />Let’s build around it.</h2><p>Our platforms are just the beginning. We also design software around your business.</p></div><Link to="/services" className="design-button">Explore our solutions<ArrowUpRight size={19} /></Link></section>
    <PageEnd>Make your<br /><em>next move.</em></PageEnd>
  </DesignPage>;
}

export function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  return <DesignPage className={`detail-design detail-${product.color}`}>
    <section className="platform-detail-intro container"><Link to="/products" className="design-back"><ArrowLeft size={16} />The ecosystem</Link><div className="platform-detail-heading"><div><span className="design-kicker mono">{product.category}</span><h1><TitleLine>{product.name}</TitleLine></h1></div><Status status={product.status} /></div><div className="platform-detail-stage"><div className="platform-detail-copy" data-reveal><span className="mono">Built with purpose / {String(products.indexOf(product) + 1).padStart(2,'0')}</span><h2>{product.headline}</h2><p>{product.description}</p><div className="detail-actions">{product.url ? <Button href={product.url}>Visit {product.name}</Button> : <Button to={`/contact?interest=${encodeURIComponent(product.name)}`}>Ask about {product.name}</Button>}<Link to="/contact" className="design-inline-link">Talk to our team<ArrowUpRight size={16} /></Link></div>{!product.url && <p className="platform-development-note">Currently in development. Get in touch to follow what’s next.</p>}</div><div className="platform-detail-art" data-color={product.color} data-tilt><PlatformGlyph color={product.color} /><span className="mono">AETHERSYNC / {product.name.toUpperCase()}</span></div></div></section>
    <section className="platform-capabilities container"><div className="design-section-heading" data-reveal><span className="design-kicker mono">The essentials</span><h2>Focused on what<br /><em>moves you forward.</em></h2></div><div className="capability-grid">{product.features.map((feature,index) => <div key={feature} data-reveal><span className="mono">0{index+1} / CAPABILITY</span><Check size={28} strokeWidth={1.2} /><h3>{feature}</h3></div>)}</div></section>
    {product.slug === 'futurepath-ai' && <section className="container platform-live-shot" data-reveal><a href={product.url!} target="_blank" rel="noopener noreferrer"><img src="/projects/futurepath.jpg" alt="FuturePath AI live website" width="1200" height="900" loading="lazy" /><span>Explore the live platform<ArrowUpRight size={20} /></span></a></section>}
    <section className="platform-related container"><div className="design-section-heading" data-reveal><div><span className="design-kicker mono">Better together</span><h2>More to <em>discover.</em></h2></div><Link to="/products" className="design-inline-link">All platforms<ArrowRight size={17} /></Link></div><div className="platform-related-grid">{products.filter(p => p.slug !== product.slug).slice(0, 2).map(p => <PlatformTile key={p.slug} product={p} index={products.indexOf(p)} />)}</div></section>
    <PageEnd>Put possibility<br /><em>to work.</em></PageEnd>
  </DesignPage>;
}
