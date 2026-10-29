import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export { getSeo, publicPaths } from './seo';
export { SITE_URL } from './data/discovery';
export function renderPage(path: string) {
  return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}
