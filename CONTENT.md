# Aethersync content inventory

Source: the local checkout at `../Aethersync`, whose Git origin is `https://github.com/usman4116/Aethersync.git`. Existing local edits were retained as the source of the current website content. Network access was unavailable, so the latest remote commit was not verified.

| Content | Source | New location |
| --- | --- | --- |
| Seven owned platforms, their status and URLs | `src/pages/ProductsPage.tsx` | `src/data/content.ts`, `/products`, `/products/:slug` |
| Six service disciplines and capabilities | `src/pages/ServicesPage.tsx` | `src/data/content.ts`, `/services` |
| Seven client websites, screenshots, tags and URLs | `src/data/siteContent.ts`, `public/projects` | `src/data/projects.ts`, `/projects` |
| Founders, roles, biographies, founding year | `src/pages/AboutPage.tsx`, `public/founder.jpg` | `src/data/content.ts`, `/about` |
| Company email | `src/pages/ContactPage.tsx` | `src/data/content.ts`, `/contact` |
| Seven delivery stages and deliverables | `src/components/ProcessTimeline.tsx` | `src/data/content.ts`, `/services#process` |
| Technology stack | `src/components/TechStackGrid.tsx` | `src/data/content.ts`, home and about pages |
| Six reasons to choose Aethersync | `src/components/WhyChooseUs.tsx` | `src/data/content.ts`, `/services` |

Purple AI, Fact Checking and Laundry Management retain their **In development** status. Open ERP, Corpflow, Finraze and FuturePath AI retain their published **Live** status and destination URLs. No client metrics, testimonials, offices or social accounts were added.

The contact form prepares an email draft for `ceo@theaethersync.com`; the visitor sends it through their email application. There is no backend email service in the source repository.

The custom pixel A is a code-native SVG. The second founder is represented by initials because the source contains no portrait for him.
