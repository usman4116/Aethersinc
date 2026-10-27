import { PixelA } from '../components/Brand';
import { Button, Eyebrow } from '../components/UI';

export default function NotFound() {
  return <section className="not-found grid-paper"><div className="container"><Eyebrow>404 / A small detour</Eyebrow><PixelA /><h1>Let’s find your<br />way forward.</h1><p>This page isn’t here. There’s plenty more to explore.</p><Button to="/">Back to Aethersync</Button></div></section>;
}
