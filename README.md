# Aethersync website

An Aethersync website with a Mistral-inspired hero and navigation, plus original Products, Solutions, Our work and Company designs informed by Mistral's inner pages. The content and images come from the local `usman4116/Aethersync` checkout. See [CONTENT.md](CONTENT.md) for the source mapping.

## Current status

- Homepage, product catalogue and seven product detail routes, services, projects, about, contact, and fallback route are implemented.
- The custom pixel A, Mistral-style hero, product illustrations, portfolio screenshots, founder section and responsive styles are included.
- The original centered homepage hero is restored, including its rolling headline, pixel mascots, opening animation and native scroll parallax.
- The site uses charcoal and graphite surfaces with rich orange accents, dark plum, navy and burgundy panels, and high-contrast neutral text. Shared palette tokens in `src/index.css` cover navigation, page artwork, galleries, forms and previews.
- The inner pages use locally hosted Cabinet Grotesk, Gambetta italic and Azeret Mono, with masked title entrances, drawn SVG paths, subtle pointer tilt and scroll reveals. Product detail pages share the catalogue's design.
- Scroll storytelling now connects the product ecosystem in three chapters, traces the solutions blueprint, advances through three full project compositions, and reveals the company manifesto, stacked principles and founder portraits. Small screens retain natural vertical reading; reduced motion shows the complete content.
- The homepage work gallery uses a charcoal exhibition layout while retaining its continuous loop and hover previews. The former FuturePath feature now introduces Aethersync IDE with the requested “Pakistan’s first AI-powered IDE” headline, a link to `https://ide.theaethersync.com/`, and the site's introduction video.
- Native wheel and touch scrolling, a pinned product story, continuously looping client-work gallery with enlarged hover previews, layered parallax, scroll-linked typography and footer animation are included. See [MOTION.md](MOTION.md) for the reference analysis and implementation.
- Product and project filters, an interactive product explorer, indexed service sections, keyboard-accessible process tabs, featured-project playback controls, desktop dropdowns, mobile navigation, hover/tap website previews and email drafting are implemented.
- The live Mistral homepage and shipped motion code were inspected in Chrome. The hero uses locally stored reference fonts and pixel illustrations with Aethersync content. See MOTION.md for asset sources and animation details.
- `npm run test:motion` checks the scrolling experience, mobile behaviour, reduced motion, route cleanup and browser errors. Screenshots and results are written to `review/motion`.
- `npm run test:pages` checks the new page interactions, all seven product details and layouts from 320px to 1440px. Screenshots and results are written to `review/pages`.

## Open the site without a server

Open [preview.html](preview.html) directly in your browser. This self-contained preview includes all routes, fonts, images, the IDE video and client-side interactions. It uses hash routing to support local files.

Run `npm run preview:offline` to regenerate it after editing the source.

## Working location

The active project is in `/home/usmanfarhan/Documents/Mistral`. The local development server runs from this folder.

## Development

The project has its own dependency installation, package manifest and lockfile, including GSAP and Playwright.

Use `npm run dev` for local development, `npm run build` for a production bundle, and `npm run preview` to serve that bundle.

On another machine, run `npm ci` before these commands. Production builds prerender all public routes into complete HTML documents, then hydrate the interactive experience. `vercel.json` serves these with clean URLs and real 404 responses. Publish the `dist` directory, not the development server or offline preview.

## Search and AI discovery

The production domain is `https://www.aethersync.tech`. Every public page has its own title, description, canonical URL and connected structured data. Dedicated website development, custom software and ERP pages and a Usman Farhan founder profile are linked throughout the site. Run `npm run test:seo` after a production build. See [SEO.md](SEO.md) for domain setup, Search Console verification, sitemap submission and discovery limits.

## Contact behaviour

The form validates fields and prepares an email addressed to `ceo@theaethersync.com`. The visitor reviews and sends it through their email application. There is no backend email service and no false “message sent” confirmation.
