import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../data/content';

export function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const Icon = product.icon;
  return <div className={`product-art art-${product.color} ${large ? 'art-large' : ''}`} aria-hidden="true"><div className="art-grid" /><span className="art-corner mono">AETHERSYNC / {product.slug.toUpperCase().replace(/-/g, ' ')}</span><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="product-symbol">{product.logo ? <img src={product.logo} alt="" width="104" height="104" loading="lazy" /> : <Icon size={52} strokeWidth={1.4} />}</div><span className="art-pixel p1" /><span className="art-pixel p2" /><span className="art-pixel p3" /><div className="art-base" /><span className="art-index mono">INTELLIGENT BY DESIGN.</span></div>;
}

export function Status({ status }: { status: Product['status'] }) {
  return <span className={`status mono ${status === 'Live' ? 'status-live' : ''}`}><i aria-hidden="true" />{status}</span>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><Link to={`/products/${product.slug}`} className="product-art-link" aria-label={`Explore ${product.name}`}><ProductArt product={product} /><span className="card-arrow"><ArrowUpRight size={20} /></span></Link><div className="product-info"><div className="product-meta"><span className="mono">{product.category}</span><Status status={product.status} /></div><h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3><p>{product.description}</p><Link to={`/products/${product.slug}`} className="text-link">Explore {product.name}<ArrowUpRight size={16} /></Link></div></article>;
}
