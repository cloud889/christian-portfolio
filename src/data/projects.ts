import imageManifest from './images.json'

export type PageKind = 'desktop' | 'mobile' | 'square'
export type Page = { label: string; kind: PageKind; src: string; w: number; h: number }
export type Cover = { src: string; w: number; h: number }

/** A pinned note. x and y are percentages of the page image. */
export type Pin = { x: number; y: number; label: string; title: string; text: string }

export type Project = {
  slug: string
  name: string
  kind: string
  tags: string[]
  blurb: string
  facts: string[]
  cover: Cover | null
  pages: Page[]
  featured?: boolean
  links?: { label: string; href: string; note: string }[]
  /** Pinned-notes story, shown inside the case study */
  story?: { page: string; pins: Pin[] }
  /** Pin positions on the card cover (percentages of the cover image) */
  cardPins?: { x: number; y: number }[]
}

type Manifest = Record<string, { cover: Cover | null; pages: Page[] }>
const img = imageManifest as Manifest

const media = (slug: string) => ({ cover: img[slug]?.cover ?? null, pages: img[slug]?.pages ?? [] })

export const projects: Project[] = [
  {
    slug: 'bookedtoplay',
    name: 'BookedToPlay',
    kind: 'UX/UI case study',
    tags: ['UX/UI', 'Booking flow', 'GoHighLevel'],
    blurb:
      'A mobile-first booking experience for pickleball venues, designed inside the limits of GoHighLevel.',
    facts: [
      'Urban Rally theme across 10 pages',
      'Booking Page V2: court, date, time, review, pay, confirm',
      'Default, selected, disabled, loading, error and payment states',
      'WCAG 2.2 AA as the target',
      'Status: page design complete, platform validation in progress',
    ],
    featured: true,
    ...media('bookedtoplay'),
    cardPins: [
      { x: 17.9, y: 8.3 },
      { x: 36.4, y: 35.3 },
      { x: 60.8, y: 55.8 },
    ],
    story: {
      page: 'Book',
      pins: [
        {
          x: 17.9,
          y: 29.2,
          label: 'Progress',
          title: 'The path to payment stays visible',
          text: 'Four steps sit above the form: Select, Review, Payment and Confirmed. Players always know where they are and what comes next.',
        },
        {
          x: 36.4,
          y: 37.8,
          label: 'Court selection',
          title: 'Court selection is easy to find',
          text: 'Each court card shows its surface, price and status. The chosen court is highlighted, and a court that is not available says so on the card.',
        },
        {
          x: 60.8,
          y: 44.3,
          label: 'Booking summary',
          title: 'One summary, always in view',
          text: 'Court, date, time, duration and the total sit in a single panel beside the form, with the free-cancellation window stated before the player continues.',
        },
        {
          x: 41,
          y: 71.6,
          label: 'Time slots',
          title: 'Time slots show their state',
          text: 'Times run in order and separate available, selected and held slots clearly. Duration options of 1, 1.5 and 2 hours sit right above them.',
        },
      ],
    },
  },
  {
    slug: 'webflow-builds',
    name: 'Webflow work samples',
    kind: 'Webflow builds',
    tags: ['Webflow', 'CMS', 'SEO'],
    blurb: 'Live sites designed, built or migrated in Webflow, plus two WordPress samples.',
    facts: [
      'Responsive layouts, CMS structure and interactions',
      'WordPress to Webflow migrations with redirect and SEO checks',
      'Technical SEO on every build',
    ],
    cover: null,
    pages: [],
    links: [
      { label: 'Tatum Lawn Care', href: 'https://www.tatumlawncarewa.com/', note: 'UI/UX design, Webflow development, CMS, SEO' },
      { label: 'Silver Bullet', href: 'https://www.silverbullet-ut.com/', note: 'Design and development, interactions, SEO' },
      { label: 'Alpine Exteriors', href: 'https://www.alpineexteriorsinc.com/', note: 'Redesign and migration from WordPress' },
      { label: 'SPX Power Washing', href: 'https://www.spxpowerwashing.com/', note: 'Migration and redesign from WordPress' },
      { label: 'PGH RCS', href: 'https://www.pghrcs.com/', note: 'Webflow work sample' },
      { label: 'Suites by VTJ', href: 'https://www.suitesbyvtj.com/', note: 'Webflow work sample' },
      { label: 'NXG Services', href: 'https://www.nxgservice.com/', note: 'Webflow work sample' },
      { label: 'Your Green Clean Crew', href: 'https://www.yourgreencleancrew.com/', note: 'WordPress work sample' },
      { label: 'Tembusu Law', href: 'https://www.tembusulaw.com.sg/', note: 'WordPress work sample' },
    ],
  },
  { slug: 'data-flow', name: 'Data Flow', kind: 'Web design', tags: ['Web design', 'Figma'], blurb: 'Website page designs.', facts: ['7 page designs'], ...media('data-flow') },
  { slug: 'hidden-power', name: 'Hidden Power Co', kind: 'Web design', tags: ['Web design', 'Shop'], blurb: 'Website page designs, including shop and product pages.', facts: ['7 page designs'], ...media('hidden-power') },
  { slug: 'lkf', name: 'LKF', kind: 'Web design', tags: ['Web design', 'Figma'], blurb: 'Website page designs.', facts: ['7 page designs'], ...media('lkf') },
  { slug: 'pearl-farm', name: 'Pearl Farm', kind: 'Web design', tags: ['Web design'], blurb: 'Website page designs.', facts: ['3 page designs'], ...media('pearl-farm') },
  { slug: 'black-flame-doctrine', name: 'The Black Flame Doctrine', kind: 'Web design', tags: ['Web design'], blurb: 'Website page designs.', facts: ['5 page designs'], ...media('black-flame-doctrine') },
  { slug: 'rc-financial', name: 'R&C Financial', kind: 'Web design', tags: ['Web design'], blurb: 'Website page designs.', facts: ['4 page designs'], ...media('rc-financial') },
  { slug: 'behind-the-logo', name: 'Behind The Logo', kind: 'Web design', tags: ['Web design', 'Branding'], blurb: 'Website page designs.', facts: ['4 page designs'], ...media('behind-the-logo') },
  { slug: 'bites-by-sweden', name: 'Bites By Sweden', kind: 'Web design', tags: ['Landing page', 'Product page'], blurb: 'A landing page and a product page design.', facts: ['2 page designs'], ...media('bites-by-sweden') },
  { slug: 'more-websites', name: 'More websites', kind: 'Web design', tags: ['Web design'], blurb: 'Whitehall and Associates, and Wilderness Redefined.', facts: ['2 page designs'], ...media('more-websites') },
  { slug: 'brand-and-social', name: 'Brand and social', kind: 'Graphic design', tags: ['Logos', 'Social ads'], blurb: 'Logo work and social media advertising graphics.', facts: ['4 logos', '4 social media ads'], ...media('brand-and-social') },
]

export type SiteKind = 'design-build' | 'migration' | 'sample' | 'wordpress'
export type Site = { name: string; href: string; host: string; role: string; tags: string[]; kind: SiteKind; shot?: string }

/** Live client sites. `shot` is the homepage hero, made by scripts/build-webflow.mjs. */
export const sites: Site[] = [
  { name: 'Tatum Lawn Care', href: 'https://www.tatumlawncarewa.com/', host: 'tatumlawncarewa.com', role: 'UI/UX design, Webflow development, CMS and SEO.', tags: ['Design', 'Webflow', 'CMS', 'SEO'], kind: 'design-build', shot: '/work/webflow/tatum.webp' },
  { name: 'Silver Bullet', href: 'https://www.silverbullet-ut.com/', host: 'silverbullet-ut.com', role: 'Design and development, interactions and SEO.', tags: ['Design', 'Webflow', 'Interactions', 'SEO'], kind: 'design-build', shot: '/work/webflow/silverbullet.webp' },
  { name: 'Alpine Exteriors', href: 'https://www.alpineexteriorsinc.com/', host: 'alpineexteriorsinc.com', role: 'Redesign and migration from WordPress.', tags: ['Redesign', 'Migration', 'Webflow'], kind: 'migration', shot: '/work/webflow/alpine.webp' },
  { name: 'SPX Power Washing', href: 'https://www.spxpowerwashing.com/', host: 'spxpowerwashing.com', role: 'Migration and redesign from WordPress.', tags: ['Redesign', 'Migration', 'Webflow'], kind: 'migration', shot: '/work/webflow/spx.webp' },
  { name: 'PGH RCS', href: 'https://www.pghrcs.com/', host: 'pghrcs.com', role: 'Webflow work sample.', tags: ['Webflow'], kind: 'sample', shot: '/work/webflow/pghrcs.webp' },
  { name: 'Suites by VTJ', href: 'https://www.suitesbyvtj.com/', host: 'suitesbyvtj.com', role: 'Webflow work sample.', tags: ['Webflow'], kind: 'sample', shot: '/work/webflow/vtj.webp' },
  { name: 'NXG Services', href: 'https://www.nxgservice.com/', host: 'nxgservice.com', role: 'Webflow work sample.', tags: ['Webflow'], kind: 'sample', shot: '/work/webflow/nxg.webp' },
  { name: 'Your Green Clean Crew', href: 'https://www.yourgreencleancrew.com/', host: 'yourgreencleancrew.com', role: 'WordPress work sample.', tags: ['WordPress'], kind: 'wordpress' },
  { name: 'Tembusu Law', href: 'https://www.tembusulaw.com.sg/', host: 'tembusulaw.com.sg', role: 'WordPress work sample.', tags: ['WordPress'], kind: 'wordpress' },
]

export const screenCount =(p: Project) => (p.pages.length > 0 ? `${p.pages.length} screens` : `${p.links?.length ?? 0} sites`)
