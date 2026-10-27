export interface ClientProject {
  slug: string;
  name: string;
  client: string;
  category: string;
  description: string;
  deliverable: string;
  image: string;
  url: string;
  tags: string[];
  featured: boolean;
}

/**
 * Client-facing work lives in one place so the homepage, work page and SEO
 * copy all use the same approved names. These are screenshots and links to
 * shipped front-ends, not claims about client revenue or conversion results.
 */
export const clientProjects: ClientProject[] = [
  {
    slug: 'acrylica',
    name: 'Acrylica',
    client: 'Acrylica',
    category: 'Product / Retail',
    description: 'A single-product storefront with an editorial rhythm and a confident buying journey.',
    deliverable: 'E-commerce front-end',
    image: '/projects/acrylica.jpg',
    url: 'https://unique-acrylica.vercel.app/',
    tags: ['Retail', 'Responsive web', 'Product story'],
    featured: true,
  },
  {
    slug: 'lumea',
    name: 'Lumea Skin Care',
    client: 'Lumea Skin Care',
    category: 'Beauty / E-commerce',
    description: 'A calm, tactile product story that lets a skincare range do the talking.',
    deliverable: 'Commerce experience',
    image: '/projects/lumea.jpg',
    url: 'https://lumea-skin-care-shop.vercel.app/',
    tags: ['Beauty', 'E-commerce', 'Art direction'],
    featured: true,
  },
  {
    slug: 'rexo',
    name: 'Rexo Perfume',
    client: 'Rexo Perfume',
    category: 'Fragrance / E-commerce',
    description: 'A dark, high-contrast storefront designed to make a small catalogue feel premium.',
    deliverable: 'Brand-led storefront',
    image: '/projects/rexo.jpg',
    url: 'https://rexo-perfume-shop.vercel.app/',
    tags: ['Fragrance', 'Retail', 'Visual design'],
    featured: true,
  },
  {
    slug: 'coffee-shop',
    name: 'Coffee Shop',
    client: 'Coffee Shop',
    category: 'Hospitality',
    description: 'A menu-led café experience built around large imagery, quick scanning and warm detail.',
    deliverable: 'Hospitality website',
    image: '/projects/coffee-shop.jpg',
    url: 'https://coffee-shop-eight-eosin.vercel.app/',
    tags: ['Hospitality', 'Menu', 'Responsive web'],
    featured: false,
  },
  {
    slug: 'studio-shodwe',
    name: 'Studio Shodwe',
    client: 'Studio Shodwe',
    category: 'Interiors / Decor',
    description: 'A vintage-leaning catalogue that gives every collection room to breathe.',
    deliverable: 'Editorial catalogue',
    image: '/projects/jewelry-shop.jpg',
    url: 'https://jewelery-shop-zeta.vercel.app/',
    tags: ['Interiors', 'Catalogue', 'Editorial'],
    featured: false,
  },
  {
    slug: 'larana',
    name: 'Larana Parlour',
    client: 'Larana Parlour',
    category: 'Services / Salon',
    description: 'A service-first site that turns a treatment menu into a clear path to booking.',
    deliverable: 'Service website',
    image: '/projects/larana.jpg',
    url: 'https://larana-parlour-site.vercel.app/',
    tags: ['Beauty', 'Services', 'Booking flow'],
    featured: false,
  },
  {
    slug: 'watches',
    name: 'Watches',
    client: 'Watches',
    category: 'Product / Retail',
    description: 'A detail-led timepiece catalogue with close crops and a considered luxury pace.',
    deliverable: 'Retail front-end',
    image: '/projects/watches.jpg',
    url: 'https://watches-site-lake.vercel.app/',
    tags: ['Luxury retail', 'Catalogue', 'Product detail'],
    featured: false,
  },
];

export const projectCategories = [
  'All work',
  'Product / Retail',
  'Beauty / E-commerce',
  'Hospitality',
  'Interiors / Decor',
  'Services / Salon',
  'Fragrance / E-commerce',
] as const;

export const featuredClientProjects = clientProjects.filter((project) => project.featured);
