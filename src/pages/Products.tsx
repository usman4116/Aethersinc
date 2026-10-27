import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { products } from '../data/content';
import { ProductArt, ProductCard, Status } from '../components/ProductCard';
import { Button, ContactCta, Eyebrow, PageHero, Reveal } from '../components/UI';
import NotFound from './NotFound';

const filters = ['All platforms', 'Artificial intelligence', 'Business operations', 'Finance'] as const;

export default function Products() {
  const [filter, setFilter] = useState<string>('All platforms');
  const filtered = products.filter(p => filter === 'All platforms' || (filter === 'Artificial intelligence' && p.category.startsWith('AI')) || (filter === 'Finance' && p.slug === 'finraze') || (filter === 'Business operations' && ['open-erp', 'corpflow', 'laundry-management'].includes(p.slug)));
  return <><PageHero eyebrow="Our products" title={<>One ecosystem.<br /><span className="text-orange">Endless possibility.</span></>} description="Seven platforms of our own. From AI assistants to enterprise operations, we build intelligent software that makes a difference to how work gets done."><div className="hero-stat-pair"><div><strong>07</strong><span className="mono">Owned platforms</span></div><div><strong>04</strong><span className="mono">Live today</span></div></div></PageHero><section className="section catalog-section"><div className="container"><div className="filter-bar"><div className="filter-buttons" role="group" aria-label="Filter products">{filters.map(item => <button key={item} type="button" aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="mono result-count" aria-live="polite">{String(filtered.length).padStart(2, '0')} PLATFORMS</span></div><div className="catalog-grid">{filtered.map(product => <ProductCard key={product.slug} product={product} />)}</div></div></section><ContactCta /></>;
}

export function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  if (!product) return <NotFound />;
  return <><section className="product-detail-hero grid-paper"><div className="container"><Link to="/products" className="back-link"><ArrowLeft size={15} />All products</Link><div className="detail-split"><div><Eyebrow>{product.category}</Eyebrow><Status status={product.status} /><h1>{product.name}</h1><h2>{product.headline}</h2><p className="lede">{product.description}</p><div className="hero-actions">{product.url ? <Button href={product.url}>Visit {product.name}</Button> : <Button to={`/contact?interest=${encodeURIComponent(product.name)}`}>Ask about {product.name}</Button>}<Button to="/contact" variant="outline">Talk to our team</Button></div>{!product.url && <p className="development-note">This platform is in development. Contact us to learn more.</p>}</div><ProductArt product={product} large /></div></div></section><section className="section product-features"><div className="container"><div className="section-heading"><div><Eyebrow>Built with purpose</Eyebrow><h2>Intelligence that<br />fits your world.</h2></div><p>{product.description}</p></div><div className="feature-grid">{product.features.map((feature, index) => <div key={feature}><span className="mono">0{index + 1}</span><Check size={27} /><h3>{feature}</h3></div>)}</div></div></section>{product.slug === 'futurepath-ai' && <section className="container product-screenshot"><img src="/projects/futurepath.jpg" alt="FuturePath AI live website" width="1200" height="900" loading="lazy" /><a className="text-link" href={product.url!} target="_blank" rel="noopener noreferrer">Explore the live platform<ArrowUpRight size={17} /></a></section>}<section className="section related-section"><div className="container"><Eyebrow>Part of something bigger</Eyebrow><h2>Meet the rest of the ecosystem.</h2><div className="related-grid">{products.filter(p => p.slug !== product.slug).slice(0, 3).map(p => <Reveal key={p.slug}><ProductCard product={p} /></Reveal>)}</div></div></section><ContactCta /></>;
}
