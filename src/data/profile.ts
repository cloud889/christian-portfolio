// All facts below come from the CV (2025), the professional profile and the Webflow work portfolio.

export const profile = {
  name: 'Christian John Gundino',
  eyebrow: 'Webflow · UI/UX · Technical SEO',
  role: 'Web developer and designer, Philippines',
  lead: 'Websites built to be easy to scan, easy to act on, and easy to find. Design in Figma, build in Webflow or WordPress, ship with SEO already in place.',
  email: 'cjgundino2@gmail.com',
  availability: 'Open to remote work',
  contactLine: 'Open to remote work, including US overlap hours',
}

export type Kpi = { value: number; suffix: string; label: string; primary?: boolean }

export const kpis: Kpi[] = [
  { value: 80, suffix: '+', label: 'Client sites maintained', primary: true },
  { value: 6, suffix: '+', label: 'Years in web development' },
  { value: 9, suffix: '+', label: 'Years in graphic design' },
  { value: 3, suffix: '', label: 'Webflow certificates' },
]

export const ticker = [
  'Webflow CMS',
  'GSAP and ScrollTrigger',
  'Figma to launch',
  'Technical SEO',
  'Core Web Vitals',
  'WordPress to Webflow migrations',
  'Schema markup',
  'GoHighLevel funnels',
  'Local SEO',
  'Responsive QA',
]

export const bars = [
  { label: 'Graphic design', note: '9+ yrs', value: 1 },
  { label: 'Web development', note: '6 yrs', value: 0.67 },
  { label: 'Webflow, as main platform', note: '2 yrs 7 mo', value: 0.29 },
]

export const toolbox: { name: string; hot?: boolean }[] = [
  { name: 'Webflow', hot: true },
  { name: 'GSAP', hot: true },
  { name: 'ScrollTrigger', hot: true },
  { name: 'WordPress (30+ sites)' },
  { name: 'Elementor' },
  { name: 'Figma' },
  { name: 'HTML / CSS / JS' },
  { name: 'Finsweet' },
  { name: 'GoHighLevel' },
  { name: 'Technical SEO' },
  { name: 'GA4' },
  { name: 'Search Console' },
  { name: 'Ahrefs' },
  { name: 'Photoshop' },
  { name: 'Illustrator' },
  { name: 'After Effects' },
  { name: 'Premiere Pro' },
  { name: 'Claude Code' },
]

export const certificates = ['Webflow CMS Certification', 'Webflow Layout, level 1', 'Webflow 101']

export const timeline = [
  { title: 'Webflow Designer/Developer, On-Page and Technical SEO', meta: 'Local Comets · Mar 2024 – now' },
  { title: 'Web Designer/Developer, freelance', meta: 'Jul 2023 – 2024' },
  { title: 'Senior UX/UI Designer', meta: 'Best SEO (Singapore) · Oct 2022 – Jul 2023' },
  { title: 'Senior UX/UI Designer', meta: '10X Ventures · Nov 2021 – Dec 2022' },
  { title: 'Multimedia Designer', meta: 'Lasting Impact / Vesils Studio · Nov 2019 – 2021' },
  { title: 'B.S. Information Technology', meta: 'University of Mindanao · 2016 – 2020' },
  { title: 'Multimedia Design and Animation', meta: 'Jobs Academy · 2012 – 2014' },
]
