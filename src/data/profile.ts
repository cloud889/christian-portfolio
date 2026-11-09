// All facts below come from the CV (2025), the professional profile and the Webflow work portfolio.

export const profile = {
  name: 'Christian John Gundino',
  eyebrow: 'Webflow · UI/UX · Technical SEO',
  role: 'Web developer and designer, Philippines',
  lead: 'I build websites that balance aesthetics with a clear purpose: helping your business grow. With on-page and technical SEO foundations, conversion-focused design, and intuitive user flows, every page guides visitors toward taking action. Sound like what you’re looking for? Let’s connect.',
  email: 'cjgundino2@gmail.com',
  github: 'https://github.com/cloud889',
  linkedin: 'https://www.linkedin.com/in/christian-john-gundino-52596798/',
  whatsapp: '+639399308185',
  whatsappLink: 'https://wa.me/639399308185',
  availability: 'Open to remote work',
  contactLine: 'Open to remote work, including US overlap hours',
}

export type Kpi = { value: number; suffix: string; label: string; primary?: boolean }

export const kpis: Kpi[] = [
  { value: 6, suffix: '+', label: 'Years in web development', primary: true },
  { value: 9, suffix: '+', label: 'Years in graphic design' },
  { value: 3, suffix: '', label: 'Webflow certificates' },
  { value: 80, suffix: '+', label: 'Client sites maintained' },
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

// Self-rated mastery, in percent. Bar length and label both come from `pct`.
// Each bar gets its own hue. Coral is left out on purpose: it is reserved for pins.
const mastery = [
  { label: 'Figma', pct: 95, color: '#b79bff' },
  { label: 'Webflow', pct: 92, color: '#7fa8ff' },
  { label: 'Web development, front end and back end', pct: 87, color: '#8fe3ff' },
  { label: 'WordPress', pct: 85, color: '#6fe3c1' },
  { label: 'On-page technical SEO', pct: 78, color: '#ffd37a' },
  { label: 'Adobe Photoshop and Illustrator', pct: 75, color: '#ff9fcb' },
]
export const bars = mastery.map((m) => ({ label: m.label, note: `${m.pct}%`, value: m.pct / 100, color: m.color }))

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
