/** Architectural framing shared by the four editorial landing pages. */
export function InteriorHeroFrame({ variant }: { variant: 'products' | 'solutions' | 'work' | 'company' }) {
  return <div className={`interior-hero-frame frame-${variant}`} aria-hidden="true">
    <div className="interior-hero-halo" />
    <svg className="interior-hero-vault" viewBox="0 0 600 700" fill="none">
      {[0, 1, 2, 3].map(i => <path key={i} transform={`translate(${i * 19} ${i * 25}) scale(${1 - i * .063})`} d="M30 700V350C30 220 140 160 200 150C200 85 270 60 300 20C330 60 400 85 400 150C460 160 570 220 570 350V700" stroke="currentColor" strokeWidth="1" />)}
    </svg>
    {['left', 'right'].map(side => <div className={`interior-hero-rail rail-${side}`} key={side}><span className="rail-rule" /><i /><div className="interior-hero-tile" /><div className="interior-hero-tile" /><div className="interior-hero-tile" /></div>)}
    <span className="interior-hero-signature">AETHERSYNC · DESIGNED WITH INTENT</span>
  </div>;
}
