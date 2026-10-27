export function HeroVisual() {
  return <div className="hero-art" aria-hidden="true">
    <img className="hero-claw" src="/hero/claw.svg" alt="" width="48" height="48" />
    <div className="hero-rail hero-rail-left">
      <i className="hero-orbit" /><i className="hero-point point-orbit" /><i className="hero-point point-left" />
      <picture className="hero-cat hero-sprite"><source media="(prefers-reduced-motion: reduce)" srcSet="/hero/cat.png" /><img src="/hero/cat.gif" alt="" width="64" height="56" /></picture>
      <div className="hero-square square-yellow" /><div className="hero-square square-orange" />
    </div>
    <div className="hero-floor"><div className="hero-floor-left"><div className="hero-square square-small square-yellow" /><div className="hero-square square-small square-red" /><img className="hero-factory hero-sprite" src="/hero/factory.svg" alt="" width="48" height="48" /></div><div className="hero-floor-right"><img className="hero-robot hero-sprite" src="/hero/robot.svg" alt="" width="48" height="48" /><div className="hero-square square-small square-yellow" /><div className="hero-square square-diamond square-orange" /></div></div>
    <div className="hero-rail hero-rail-right"><i className="hero-point point-right" /><div className="hero-square square-diamond square-orange" /><div className="hero-square square-yellow" /><div className="hero-square square-amber" /></div>
  </div>;
}
