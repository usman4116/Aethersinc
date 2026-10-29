# Aethersync motion design

The live [Mistral.ai homepage](https://mistral.ai/) and its shipped animation code were inspected in Chrome on 28 October 2026. The hero and navigation reproduce the current reference with Aethersync branding, copy and product links.

## Hero and navigation

- A fixed 48px navigation bar uses bordered cells, left-aligned navigation, a contact link and a dark dropdown trigger. Desktop dropdowns support click, outside dismissal and Escape with focus restoration. Mobile navigation slides in from the right and provides nested product, service and company panels.
- The centered two-line headline uses the reference's locally hosted ALT Mistral font. Letters roll upward through masks with a one-second `power4.inOut` ease, staggered offsets, and a 0.735-second separation between lines. Selected letters roll through a duplicate glyph.
- Orange and yellow blocks expand into place over 0.8 seconds with `power4.out` easing and an 0.08-second stagger. The shapes then shift and rotate in a repeating, reversing sequence that pauses outside the viewport.
- The pixel claw follows mouse movement after a 500ms delay, easing into position over two seconds.
- Native browser scrolling drives GSAP ScrollTrigger. Across the hero, the headline moves down by 50% of its height and the background by 10% of its height. There is no additional scroll smoothing or hero pin.
- A continuous strip of Aethersync platform links follows the hero. Hover or keyboard focus pauses the strip.

`src/components/MistralHero.tsx` owns the hero timelines; `src/components/HeroVisual.tsx` contains its illustration. `src/components/Header.tsx` owns navigation. Their styles are in `src/hero.css`. The gallery and popup live in `HorizontalWork.tsx` and `WorkPreview.tsx`, with styles in `src/motion.css`.

## Homepage motion

The four product chapters share a pinned desktop stage, with scroll-linked artwork and an active chapter indicator. The client-work gallery runs as a continuous horizontal loop at 42 pixels per second, independent of page scrolling. Two identical groups meet without a gap at the loop boundary. Hovering a website opens a larger preview that animates from the card into a centered browser window over a blurred backdrop. Moving outside the popup closes it and resumes the gallery. Touch and keyboard users open previews by activating the card; Close, Escape and backdrop dismissal remain available. A pause control and keyboard focus can also hold the gallery. Statement words reveal progressively, selected images have restrained parallax, and the footer wordmark rises into view.

## Products, Solutions, Our work and Company

References inspected in Chrome include Mistral's [Products](https://mistral.ai/products/), [Studio](https://mistral.ai/products/studio/), [Coding solutions](https://mistral.ai/solutions/coding/), [Customers](https://mistral.ai/customers/) and [About](https://mistral.ai/about/) pages. Their large color fields, modular product presentations, customer imagery and editorial hierarchy inform four distinct Aethersync layouts.

- Products: violet and lime, a seven-platform explorer, and a sticky connection diagram that assembles intelligence, operations and possibility as three text chapters pass. The catalogue remains filterable. Product detail pages retain each platform's actual availability, capabilities and destination.
- Solutions: an orange engineering schematic followed by a sticky blueprint and discipline index. The blueprint draws across six service chapters, chapter headings illuminate with scrolling, and large numerals move at a different pace. Process tabs remain keyboard-operated.
- Our work: three full project compositions with their own colors, large website images and project context. Desktop scrolling pins the stage and lifts each composition over the previous one. Chapter controls move to the matching scroll position; inactive panels are inert. Smaller screens and reduced motion show a vertical sequence. The archive remains filterable, and project activation opens the shared enlarged preview.
- Company: a manifesto that illuminates word by word, a sticky origin panel, principles that stack with depth, and portraits that reveal through expanding masks. The founder without a supplied photo uses a designed monogram. Small screens use a natural vertical layout.

`DesignPage.tsx` scopes GSAP title masks, scroll reveals, SVG drawing and desktop pointer tilt to the current route. `DesignArt.tsx` supplies native SVG artwork. `src/pages.css` contains the page designs and responsive rules. Reduced motion exposes all content immediately, stops continuous artwork motion and replaces the pinned project sequence with a vertical layout.

`ProductJourney.tsx` owns the product connection story. `WorkReel.tsx` owns the pinned portfolio sequence and its keyboard focus rules. `src/storytelling.css` contains their layouts, the redesigned homepage gallery, the IDE feature and the company stack. `DesignPage.tsx` also owns reading progress, progressive text, image masks and service chapter motion, refreshing scroll measurements when content height changes.

## IDE introduction

The homepage feature links to [Aethersync IDE](https://ide.theaethersync.com/). Its video comes from the live site's `/shots/hero-video.mp4` and is byte-identical to `public/shots/hero-video.mp4` in the local `usman4116/Aethersync` checkout. A poster is extracted from the video. This is the existing 10-second branded introduction, not a screen recording of editor interaction.

The film frame expands and straightens with scrolling. Muted playback loops only while visible and the document is active; the pause control preserves the visitor's choice. Reduced motion starts with a static poster and allows manual playback. The offline preview embeds both video and poster.

Cabinet Grotesk (400, 500, 700 and 800) and Gambetta italic (400) are locally stored from [Fontshare](https://www.fontshare.com/). Azeret Mono comes from [Google Fonts](https://fonts.google.com/specimen/Azeret+Mono). No external font service is required at runtime.

## Responsive and accessibility behaviour

- The hero's geometry and timelines are rebuilt at the 1024px breakpoint, using 120px desktop blocks and 60px mobile blocks.
- Below 1000px, the product story uses a vertical layout. The project gallery continues looping with smaller cards; reduced motion replaces its loop with a manually scrollable strip.
- Wheel and touch input both use native scrolling.
- Reduced motion disables entrances, parallax, pinning and continuous movement. The flag and cat use static PNG frames in this mode.
- The mobile menu locks background scrolling and makes the page content inert. Escape, closing the menu, resizing to desktop and route changes release it.
- Inactive desktop product panels remain inert. Chapter buttons and gallery focus navigation remain available. Website previews contain keyboard focus and restore the page when dismissed.
- Component cleanup removes animation timelines, scroll triggers and pointer handlers when routes or responsive modes change.

## Reference assets

The local `public/hero` assets come from the inspected Mistral homepage: the flag from `/cms-media/api/media/file/sovereign-flag.gif`, the cat from `/images/cat/cat-sitting-black.gif`, and the claw, factory and robot from the homepage's inline SVGs. Static PNGs are first-frame derivatives of the GIFs. The two ALT Mistral fonts came from `/fonts/alt-mistral/` on the same site. Runtime requests use these local files; the page does not depend on the reference site being reachable.

## Verification

Start the app on port 5177, then run `npm run test:motion`. The browser check covers hero completion, title clipping, the 48px header, dropdown dismissal, hero parallax, responsive block sizing, native wheel and touch input, product chapters, continuous gallery motion and wraparound, hover and touch previews, pause controls, route cleanup, mobile navigation and reduced motion.

Screenshots and the report are written to `review/motion`. Set `AETHERSYNC_BASE_URL` to check another running preview, or `AETHERSYNC_BROWSER` to select a Chrome/Chromium executable. Run `npm run build` for TypeScript and production bundling, and `npm run preview:offline` to refresh the self-contained preview.

Run `npm run test:pages` to check product selection and filters, service section links and process tabs, scroll-driven project chapters and previews, founder content, all seven product detail routes, and reduced motion. It checks 320, 390, 768, 1024 and 1440px widths and writes screenshots and results to `review/pages`.

## Editorial refinement

The homepage uses three chapter dividers to connect possibilities, proof, and partnership. Product story artwork is now a labelled capability map using the actual platform feature list; it is not a screenshot or a live product simulation. Its rows enter progressively during the existing desktop chapter sequence. Product detail pages share these maps.

The services accordion updates a three-stage workflow diagram, whose connecting line draws as it enters view. The process journey introduces four phases above seven selectable steps, each with three concrete deliverables. At desktop widths of at least 1100px and heights of at least 850px, the process panel pins for 1600px of native scroll and advances through the seven stages. Clicking or using arrow keys selects the matching scroll position. Smaller screens and reduced motion keep manual tabs without pinning.

The Company hero now features the supplied founder portrait, with an additional origin/platforms/today timeline. Featured work presents existing project tags and deliverables without adding unverified commercial outcomes. Shared copper controls, quieter architectural framing, improved labels, contact framing, and footer spacing are in `src/refinement.css`.
