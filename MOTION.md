# Aethersync motion design

The live [Mistral.ai homepage](https://mistral.ai/) was inspected in Chrome on 27 October 2026, including intermediate scroll positions and its shipped animation code.

The reference uses generous whitespace, ruled sections, pixel illustrations, restrained colour, sticky product navigation, scroll-linked parallax, staggered entrances and an animated footer. Its GSAP timelines use ScrollTrigger scrubbing and eased entrances. Aethersync uses its own illustrations, content and timelines to apply that rhythm.

| Reference pattern | Aethersync implementation |
| --- | --- |
| Pixel graphics entering in a sequence | The custom A builds from individual pixels; system nodes enter in staggered order |
| Different layers moving at different speeds | The hero text and system illustration move in opposite directions as the page scrolls |
| Sticky product navigation | Four product chapters share a pinned desktop stage, with scroll-linked text, artwork and an active chapter indicator |
| Modular visual sequences | Selected client projects move horizontally through a pinned gallery |
| Large editorial transitions | The orange statement reveals its words progressively as it enters the viewport |
| Quiet supporting motion | Images have a small parallax movement, navigation unfolds, buttons animate, and the footer wordmark rises into view |
| A steady reading rhythm | Lenis smooths mouse-wheel scrolling and feeds the GSAP ticker; a thin bar shows reading progress |

The animated product story preserves the published product statuses and URLs. Product artwork is a visual identity, not a claim about a working product interface.

## Responsive and accessibility behaviour

- Below 1000px, both pinned sections use ordinary vertical layouts. Every product chapter and project remains available.
- Touch scrolling stays native; touch synchronization and artificial momentum are disabled.
- Reduced-motion preference disables smooth scrolling, pinning, parallax, staggered entrances and the continuous technology strip.
- Inactive desktop product panels are inert, so keyboard focus cannot enter hidden links.
- Chapter buttons support jumping through the story. Gallery focus moves the corresponding project into view.
- Route changes destroy the old timelines and pin spacers before starting the new page.

## Verification

Run the site, then execute `npm run test:motion`. The browser check covers chapter transitions, chapter buttons, product links, pin cleanup, horizontal-gallery completion, wheel and native touch input, mobile menus, reduced motion and page overflow at 320, 390, 768, 1024 and 1440px.

Screenshots and the check report are written to `review/motion`. Set `AETHERSYNC_BASE_URL` to check a production preview, and `AETHERSYNC_BROWSER` to choose a Chrome/Chromium executable. The script uses the system Chrome on this machine.

If system Chrome is unavailable, install Playwright's browser with `npx playwright install chromium` before running the check.

The production build, development site and self-contained offline preview were verified in Chrome. The scrolling checks pass at the viewport sizes listed above, including a native touch drag and reduced-motion rendering, with no JavaScript or console errors.
