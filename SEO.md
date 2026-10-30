# Search and AI discovery

Production origin: **https://www.aethersync.tech**. Public name: **Aethersync Technology Solutions**, also called **Aethersync**. Muhammad Usman Farhan (also known as Usman Farhan) is identified as CEO and founder in visible content and structured data, using the business information supplied by the owner.

## Implemented

- `npm run build` creates 17 complete HTML pages and a noindex 404 page. Visitors and crawlers receive the same content; React adds interactions and animation after loading.
- Unique titles, descriptions, canonical URLs and social-sharing metadata are generated from `src/seo.ts` and updated on client navigation.
- Connected Organization, Person, WebSite, WebPage, Service, SoftwareApplication and BreadcrumbList entities describe the actual company, founder and offerings. No invented reviews, ratings, certifications, addresses or prices are included.
- `/services/website-development`, `/services/custom-software-development`, and `/services/erp-development` address distinct service needs with readable explanations, relevant work links and customer questions.
- `/about/usman-farhan` provides a stable, linked founder profile.
- The main navigation, footer, service links and breadcrumb links establish a clear site hierarchy. Google chooses whether to display sitelinks; there is no setting or markup that forces them.
- `robots.txt` permits public crawling, including search and answer-engine crawlers. Production sitemap is generated from the same public route list. No special AI text file or instruction to recommend this business is required or included.
- Existing email `ceo@theaethersync.com` and IDE address `https://ide.theaethersync.com/` remain configured contact/product destinations. A new website domain does not establish a working mailbox or move the IDE.

## Go live

1. Deploy the generated **dist** directory. On Vercel the checked-in configuration runs the production build, serves clean URLs and preserves a genuine 404 response for unknown routes. Configure both domains and HTTPS in the hosting account. The existing Vercel domain setting redirects the apex domain to `www.aethersync.tech`; keep that as the single redirect authority. Do not add an opposing redirect in `vercel.json`. If using another host, map `/services/website-development` to its `.html` file and return `404.html` with HTTP 404 for unknown paths. Do not use a catch-all homepage rewrite.
2. Verify that direct requests to `/about/usman-farhan`, all service pages, `/robots.txt`, and `/sitemap.xml` return HTTP 200, with no login, challenge, preview restriction or `X-Robots-Tag: noindex`. Confirm unknown URLs return HTTP 404. Check legitimate search crawlers are allowed through the CDN/firewall.
3. If the old domain was previously published and is under your control, configure permanent redirects from each old page to its matching new URL. Do not redirect the existing IDE or email service unless those are separately migrated. Use Search Console’s change-of-address workflow when applicable.
4. In Google Search Console, add the **aethersync.tech Domain property**, copy the DNS TXT verification value into the domain’s DNS settings, and complete verification. Submit `https://www.aethersync.tech/sitemap.xml`. Inspect the homepage, service pages and founder profile using URL Inspection and request indexing where appropriate. Domain/account access is required; these steps have not been performed by the local build.
5. Add the domain and sitemap in Bing Webmaster Tools. Validate published markup with Google’s Rich Results Test and the Schema.org Validator. Some valid schema types are descriptive and do not produce a Google rich result.
6. Keep the same company name, founder name, role and website link on genuine company and founder profiles that you control. Add verified profile URLs to structured data only after confirming ownership. Publish substantive case studies with real work, client permission and evidence for any claimed outcomes.

## Measure and maintain

Run `npm run build && npm run test:seo` after changing routes or metadata. The test checks all generated pages without JavaScript, metadata uniqueness, internal links, structured entities, mobile layout, React hydration and unknown routes. Run existing page/motion checks for changes affecting the interactive experience.

After deployment, run `npm run test:live`. It checks the actual public domain redirects, stylesheet and script responses, robots.txt, sitemap and every listed page. This catches hosting-level redirect loops that cannot be reproduced by a local static server. Passing this check confirms technical accessibility, not Google indexing or ranking.

Use Search Console to monitor impressions, clicks, indexing, Core Web Vitals and queries such as “aethersync”, “aethersync website development”, “aethersync ERP” and “Usman Farhan”. Broad service terms are competitive; useful content, real evidence, reputation and performance matter beyond technical configuration. Submit new or changed useful pages through the sitemap, not repeated manual indexing requests.

This implementation prepares the site for discovery. It does not itself publish the domain, verify search accounts, prove indexing, secure traffic, guarantee sitelinks or cause every AI system to recommend the company. AI systems may distinguish different people named Usman Farhan and choose sources or providers based on the question.

## Official references

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: sitelinks](https://developers.google.com/search/docs/appearance/sitelinks)
- [Google: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [OpenAI: crawler documentation](https://developers.openai.com/api/docs/bots)
