import { Link } from 'react-router-dom';

const pixels = ['0011100', '0111110', '1100011', '1100011', '1111111', '1100011', '1100011'];
const colors = ['#ff925c', '#f78548', '#ef7943', '#e76831', '#ce5425', '#b64721', '#a63d1b'];

export function PixelA({ className = '', monochrome = false }: { className?: string; monochrome?: boolean }) {
  return <svg className={`pixel-a ${className}`} viewBox="0 0 70 70" fill="currentColor" aria-hidden="true" shapeRendering="crispEdges">
    {pixels.flatMap((row, y) => [...row].map((pixel, x) => pixel === '1' ? <rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="10" height="10" fill={monochrome ? 'currentColor' : colors[y]} /> : null))}
  </svg>;
}

export function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Aethersync home"><PixelA monochrome={light} /><span>aethersync<span className="brand-dot">.</span></span></Link>;
}

export function PixelLandscape({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return <div className={`pixel-landscape ${compact ? 'landscape-compact' : ''} ${className}`} aria-hidden="true">
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMid slice" className="landscape-svg" shapeRendering="crispEdges">
      <path fill="#f4d483" d="M0 0h1440v360H0z" />
      <path fill="#f7cb68" d="M0 35h1440v325H0z" />
      <path fill="#f8b650" d="M0 75h1440v285H0z" />
      <path fill="#fb9a3c" d="M0 115h1440v245H0z" />
      <path fill="#fb7a2c" d="M0 155h1440v205H0z" />
      <path fill="#fa6025" d="M0 195h1440v165H0z" />
      <path fill="#ec4c22" d="M0 235h1440v125H0z" />
      <path fill="#d93c20" d="M0 275h1440v85H0z" />
      <path fill="#c2301c" d="M0 315h1440v45H0z" />
      <g fill="#faf7ef" opacity=".52"><path d="M170 62h42v14h-42zm42-14h56v14h-56zm56 14h56v14h-56zm788 19h56v14h-56zm56-14h84v14h-84zm84 14h42v14h-42z" /></g>
      <path fill="#b93b20" d="M0 238h70v-28h70v28h70v40h70v40h140v42H0zm1440-40h-70v-28h-70v28h-70v40h-70v40h-70v40h-140v42h490z" />
      <path fill="#762b21" d="M0 294h56v-28h56v28h84v28h112v38H0zm1440-8h-84v-28h-56v28h-112v36h-168v38h420z" />
      <path fill="#432b23" d="M0 336h84v-14h56v14h112v24H0zm1440-14h-70v-28h-56v28h-112v14h-84v24h322z" />
      <g stroke="#612d1e" strokeOpacity=".07" strokeWidth="1"><path d="M0 0v360M80 0v360M160 0v360M240 0v360M320 0v360M400 0v360M480 0v360M560 0v360M640 0v360M720 0v360M800 0v360M880 0v360M960 0v360M1040 0v360M1120 0v360M1200 0v360M1280 0v360M1360 0v360M1440 0v360" /></g>
    </svg>
    <div className="landscape-mark"><PixelA monochrome /></div>
    <span className="landscape-caption mono">A world of possibility.</span>
    <span className="landscape-coordinate mono">23° / AETHERSYNC</span>
  </div>;
}
