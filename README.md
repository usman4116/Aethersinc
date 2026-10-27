# Aethersync website

An original Aethersync website using the general visual direction requested from Mistral.ai: cream surfaces, orange accents, pixel branding, large typography and spacious sections. The content and images come from the local `usman4116/Aethersync` checkout. See [CONTENT.md](CONTENT.md) for the source mapping.

## Current status

- Homepage, product catalogue and seven product detail routes, services, projects, about, contact, and fallback route are implemented.
- The custom pixel A, connected-system hero, product illustrations, portfolio screenshots, founder section and responsive styles are included.
- Smooth wheel scrolling, a pinned product story, horizontal client-work gallery, layered parallax, scroll-linked typography and footer animation are included. See [MOTION.md](MOTION.md) for the reference analysis and implementation.
- Product and project filters, expandable services, keyboard-accessible process tabs, desktop dropdowns, mobile navigation and email drafting are implemented.
- Production build and TypeScript checks pass. All 14 routes pass a server-render smoke check, including image-file existence and one primary heading per page.
- The live Mistral homepage and shipped motion code were inspected in Chrome. This is an original Aethersync implementation of the visual and motion patterns, with Aethersync content and artwork.
- `npm run test:motion` checks the scrolling experience, mobile behaviour, reduced motion, route cleanup and browser errors. Screenshots and results are written to `review/motion`.

## Open the site without a server

Open [preview.html](preview.html) directly in your browser. This self-contained preview includes all routes, fonts, images and client-side interactions. It uses hash routing to support local files.

Run `npm run preview:offline` to regenerate it after editing the source.

## Working location

The active project is in `/home/usmanfarhan/Documents/nwe/Mistral`. The local development server runs from this folder.

## Development

The project has its own dependency installation, package manifest and lockfile, including GSAP, Lenis and Playwright.

Use `npm run dev` for local development, `npm run build` for a production bundle, and `npm run preview` to serve that bundle.

On another machine, run `npm ci` before these commands. For production hosting, the `vercel.json` rewrite supports direct navigation to application routes.

## Contact behaviour

The form validates fields and prepares an email addressed to `ceo@theaethersync.com`. The visitor reviews and sends it through their email application. There is no backend email service and no false “message sent” confirmation.
