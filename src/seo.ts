import { EMAIL, founders, products, services } from './data/content';
import { clientProjects } from './data/projects';
import { COMPANY_NAME, FOUNDER_PATH, SITE_URL, servicePages } from './data/discovery';

const pages: Record<string, { title: string; description: string; label: string }> = {
  '/': { title: 'Aethersync | Website, Software & ERP Development', description: 'Aethersync Technology Solutions builds websites, custom software, ERP systems and AI applications. Led by CEO and founder Usman Farhan.', label: 'Home' },
  '/products': { title: 'AI & Business Software Products | Aethersync', description: 'Explore Aethersync’s software platforms for AI, ERP, operations and finance, including Open ERP, Corpflow, Finraze and FuturePath AI.', label: 'Products' },
  '/services': { title: 'Website, Custom Software & ERP Services | Aethersync', description: 'Explore Aethersync’s website development, custom software, ERP customization, AI, cloud infrastructure and business automation services.', label: 'Services' },
  '/projects': { title: 'Website Development Portfolio | Aethersync', description: 'See Aethersync’s client website work across beauty, retail and lifestyle brands. Explore distinctive web design and development projects.', label: 'Our work' },
  '/about': { title: 'About Aethersync Technology Solutions | Our Company', description: 'Meet Aethersync Technology Solutions, established in 2023 and led by CEO and founder Muhammad Usman Farhan. Discover our software, ERP and AI work.', label: 'Company' },
  '/contact': { title: 'Contact Aethersync | Discuss Your Software Project', description: 'Discuss a website, custom software, ERP or AI project with Aethersync Technology Solutions. Share your requirements and start a conversation.', label: 'Contact' },
  [FOUNDER_PATH]: { title: 'Usman Farhan | CEO & Founder of Aethersync', description: 'Muhammad Usman Farhan, also known as Usman Farhan, is CEO and founder of Aethersync Technology Solutions, building ERP, custom software and AI solutions.', label: 'Usman Farhan' },
};

export const publicPaths = [...Object.keys(pages), ...servicePages.map(s => `/services/${s.slug}`), ...products.map(p => `/products/${p.slug}`)];
export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

export function getSeo(path: string) {
  const pathname = normalizePath(path);
  const product = products.find(p => `/products/${p.slug}` === pathname);
  const service = servicePages.find(s => `/services/${s.slug}` === pathname);
  const known = publicPaths.includes(pathname);
  const meta = product ? { title: `${product.name} — ${product.category} | Aethersync`, description: product.description, label: product.name } : service ? { title: `${service.title} | Aethersync`, description: service.description, label: service.title } : pages[pathname] ?? { title: 'Page Not Found | Aethersync', description: 'This page could not be found. Explore Aethersync’s products, services and company.', label: 'Page not found' };
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  const orgId = `${SITE_URL}/#organization`;
  const personId = `${SITE_URL}${FOUNDER_PATH}#person`;
  const ref = (id: string) => ({ '@id': id });
  const organization = { '@type': 'Organization', '@id': orgId, name: COMPANY_NAME, alternateName: 'Aethersync', url: `${SITE_URL}/`, foundingDate: '2023', email: EMAIL, logo: `${SITE_URL}/favicon.svg`, description: pages['/'].description, founder: ref(personId) };
  const person = { '@type': 'Person', '@id': personId, name: founders[0].name, alternateName: 'Usman Farhan', jobTitle: 'CEO & Founder', url: `${SITE_URL}${FOUNDER_PATH}`, image: `${SITE_URL}/founder.jpg`, description: pages[FOUNDER_PATH].description, worksFor: ref(orgId) };
  const crumbs = [{ name: 'Home', item: `${SITE_URL}/` }];
  if (pathname.startsWith('/products/')) crumbs.push({ name: 'Products', item: `${SITE_URL}/products` });
  if (pathname.startsWith('/services/')) crumbs.push({ name: 'Services', item: `${SITE_URL}/services` });
  if (pathname === FOUNDER_PATH) crumbs.push({ name: 'Company', item: `${SITE_URL}/about` });
  if (pathname !== '/') crumbs.push({ name: meta.label, item: canonical });
  const serviceSchema = (s: typeof services[number]) => ({ '@type': 'Service', '@id': `${SITE_URL}/services#${s.slug}`, name: s.fullTitle, description: s.description, provider: ref(orgId), url: `${SITE_URL}/services#${s.slug}` });
  const softwareSchema = (p: typeof products[number]) => ({ '@type': 'SoftwareApplication', '@id': `${SITE_URL}/products/${p.slug}#software`, name: p.name, description: p.description, applicationCategory: 'BusinessApplication', applicationSubCategory: p.category, operatingSystem: 'Web', url: `${SITE_URL}/products/${p.slug}`, publisher: ref(orgId), creativeWorkStatus: p.status });
  const mainEntity = product ? softwareSchema(product) : service ? { '@type': 'Service', '@id': `${canonical}#service`, name: service.title, description: service.description, serviceType: service.title, provider: ref(orgId), url: canonical } : pathname === FOUNDER_PATH ? ref(personId) : pathname === '/about' || pathname === '/' ? ref(orgId) : undefined;
  const pageType = pathname === FOUNDER_PATH ? 'ProfilePage' : pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : ['/products', '/services', '/projects'].includes(pathname) ? 'CollectionPage' : 'WebPage';
  const graph: object[] = [organization, person, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Aethersync', alternateName: COMPANY_NAME, url: `${SITE_URL}/`, publisher: ref(orgId), inLanguage: 'en' }, {
    '@type': pageType, '@id': `${canonical}#webpage`, url: canonical, name: meta.title, description: meta.description, inLanguage: 'en', isPartOf: ref(`${SITE_URL}/#website`), publisher: ref(orgId), ...(mainEntity ? { mainEntity } : {}),
    ...(pathname !== '/' ? { breadcrumb: ref(`${canonical}#breadcrumb`) } : {}),
    ...(pathname === '/products' ? { hasPart: products.map(softwareSchema) } : {}),
    ...(pathname === '/services' ? { hasPart: services.map(serviceSchema) } : {}),
    ...(pathname === '/projects' ? { hasPart: clientProjects.map(p => ({ '@type': 'CreativeWork', name: p.name, description: p.description, url: p.url, creator: ref(orgId) })) } : {}),
  }];
  if (pathname !== '/') graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) });
  return { ...meta, canonical, robots: known ? 'index, follow, max-image-preview:large' : 'noindex, follow', graph: { '@context': 'https://schema.org', '@graph': graph } };
}

export function applySeo(path: string) {
  const seo = getSeo(path);
  document.title = seo.title;
  const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
    element.content = content;
  };
  for (const [key, value] of Object.entries({ description: seo.description, robots: seo.robots, 'twitter:card': 'summary_large_image', 'twitter:title': seo.title, 'twitter:description': seo.description, 'twitter:image': `${SITE_URL}/og-image.png`, 'twitter:image:alt': 'Aethersync — Intelligent software. In your hands.' })) setMeta('name', key, value);
  for (const [key, value] of Object.entries({ 'og:type': 'website', 'og:site_name': 'Aethersync', 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.canonical, 'og:image': `${SITE_URL}/og-image.png`, 'og:image:alt': 'Aethersync — Intelligent software. In your hands.', 'og:locale': 'en_US' })) setMeta('property', key, value);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = seo.canonical;
  let schema = document.getElementById('site-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'site-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.appendChild(schema); }
  schema.textContent = JSON.stringify(seo.graph).replace(/</g, '\\u003c');
}
