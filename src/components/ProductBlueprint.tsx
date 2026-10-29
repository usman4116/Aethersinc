import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Product } from '../data/content';

/** Capability diagram, deliberately presented as a map rather than a product screenshot. */
export function ProductBlueprint({ product }: { product: Product }) {
  const Icon = product.icon;
  return <div className={`product-blueprint blueprint-${product.color}`}>
    <div className="blueprint-top"><span className="mono">CAPABILITY MAP</span><Icon size={20} strokeWidth={1.4}/></div>
    <div className="blueprint-brand product-symbol">{product.logo && <img src={product.logo} alt="" width="40" height="40" />}<div><span className="mono">AETHERSYNC PLATFORM</span><strong>{product.name}</strong></div></div>
    <div className="blueprint-path">{product.features.map((feature,i)=><div className="blueprint-step" key={feature}><span className="blueprint-node">0{i+1}</span><span>{feature}</span>{i===2?<ArrowUpRight size={17}/>:<ArrowDown size={15}/>}</div>)}</div>
    <div className="blueprint-bottom"><span>Purpose-built. Connected by design.</span><span className="blueprint-dot" /></div>
  </div>;
}
