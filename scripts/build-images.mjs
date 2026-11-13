// Converts the source design screenshots into optimized WebP files under public/work
// and writes src/data/images.json (paths + dimensions) for the app to import.
// Usage: node scripts/build-images.mjs [sourceRoot] [slug,slug]   (second argument rebuilds only those projects)
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const SRC =
  process.argv[2] ||
  'C:/Users/My PC/Desktop/downloads/my records/Portfolio landing Pages-20261106T123423Z-1-001/Portfolio landing Pages'

const BTP = 'Portfolio - Booked To Play/Booked To Play'
const WD = 'Web Design'
const CER = 'Portfolio - Booked To Play/Cerebru-20261113T020858Z-1-001/Cerebru/exports'
const CD = `${CER}/desktop-1440`
const CM = `${CER}/mobile-390`

// kind: desktop = full-page screenshot shown in a browser frame
//       mobile  = phone screen shown in a phone frame
//       square  = social/logo artwork shown in a gallery
const projects = [
  {
    slug: 'bookedtoplay',
    cover: 1,
    // crop region in 1200px-wide space: shows the step bar, court cards and summary
    coverCrop: [0, 500, 1200, 600],
    pages: [
      ['Home', `${BTP}/Main Pages Desktop/Homepage.png`, 'desktop'],
      ['Book', `${BTP}/Main Pages Desktop/Booking version 4.png`, 'desktop'],
      ['Courts and Pricing', `${BTP}/Main Pages Desktop/All Courts.png`, 'desktop'],
      ['Memberships', `${BTP}/Main Pages Desktop/Membership.png`, 'desktop'],
      ['Events', `${BTP}/Main Pages Desktop/Events Page.png`, 'desktop'],
      ['Play and Programmes', `${BTP}/Main Pages Desktop/Plays and Events.png`, 'desktop'],
      ['Facility', `${BTP}/Main Pages Desktop/Facilities.png`, 'desktop'],
      ['About and Coaches', `${BTP}/Main Pages Desktop/About Us and Coaching Page.png`, 'desktop'],
      ['FAQ and Policies', `${BTP}/Main Pages Desktop/FAQ.png`, 'desktop'],
      ['Contact and Location', `${BTP}/Main Pages Desktop/Contact Us.png`, 'desktop'],
      ['Mobile booking V2', `${BTP}/Booking Flow/Mobile - Booking V2.png`, 'mobile'],
      ['Mobile court details', `${BTP}/Booking Flow/Mobile - Court Details Page.png`, 'mobile'],
      ['Mobile form review', `${BTP}/Booking Flow/Mobile - Form Review.png`, 'mobile'],
      ['Mobile payment', `${BTP}/Booking Flow/Mobile - Payment Gcash.png`, 'mobile'],
      ['Mobile confirmation', `${BTP}/Booking Flow/Mobile - Payment Confimation.png`, 'mobile'],
      ['Mobile my bookings', `${BTP}/Booking Flow/Mobile - View My Bookings.png`, 'mobile'],
      ['Mobile login', `${BTP}/Login and Sign up Flow/Mobile - Login.png`, 'mobile'],
      ['Mobile sign up', `${BTP}/Login and Sign up Flow/Mobile - Sign up.png`, 'mobile'],
      ['UX case study', `${BTP}/Case Study/BookedToPlay \u2014 UX Case Study.png`, 'desktop'],
    ],
  },
  {
    slug: 'cerebru',
    cover: 0,
    // 4:3 so the card's pins sit exactly on the image (the case card shows a 4:3 thumbnail)
    coverCrop: [0, 0, 1200, 900],
    pages: [
      ['Home', `${CD}/01-dashboard.jpg`, 'desktop'],
      ['Chat, answered', `${CD}/02-chat-answered.jpg`, 'desktop'],
      ['Chat, new chat', `${CD}/02-chat-new-chat.jpg`, 'desktop'],
      ['Chat, no answer found', `${CD}/02-chat-unanswered-fallback.jpg`, 'desktop'],
      ['Docs library', `${CD}/03-docs-library.jpg`, 'desktop'],
      ['Docs reader', `${CD}/03-docs-reader.jpg`, 'desktop'],
      ['Client 360', `${CD}/04-clients-overview.jpg`, 'desktop'],
      ['Client tickets', `${CD}/04-clients-tickets.jpg`, 'desktop'],
      ['Ops overview', `${CD}/05-ops-overview.jpg`, 'desktop'],
      ['Ops project', `${CD}/05-ops-project.jpg`, 'desktop'],
      ['Workflows, checklists', `${CD}/06-workflows-checklists.jpg`, 'desktop'],
      ['Workflows, templates', `${CD}/06-workflows-templates.jpg`, 'desktop'],
      ['Support', `${CD}/07-support.jpg`, 'desktop'],
      ['Vault, logins', `${CD}/08-vault-logins.jpg`, 'desktop'],
      ['Vault, empty', `${CD}/08-vault-empty.jpg`, 'desktop'],
      ['Ops Inbox', `${CD}/09-ops-inbox.jpg`, 'desktop'],
      // The full written case study, rendered by scripts/render-case-study.mjs from Cerebru/case-study/index.html
      ['UX case study', path.join(root, 'scripts', '.render', 'cerebru-ux-case-study.png'), 'desktop', { format: 'jpeg' }],
      ['Mobile home', `${CM}/01-dashboard.jpg`, 'mobile'],
      ['Mobile chat', `${CM}/02-chat-answered.jpg`, 'mobile'],
      ['Mobile new chat', `${CM}/02-chat-new-chat.jpg`, 'mobile'],
      ['Mobile no answer found', `${CM}/02-chat-unanswered-fallback.jpg`, 'mobile'],
      ['Mobile docs library', `${CM}/03-docs-library.jpg`, 'mobile'],
      ['Mobile Client 360', `${CM}/04-clients-overview.jpg`, 'mobile'],
      ['Mobile client tickets', `${CM}/04-clients-tickets.jpg`, 'mobile'],
      ['Mobile ops overview', `${CM}/05-ops-overview.jpg`, 'mobile'],
      ['Mobile ops project', `${CM}/05-ops-project.jpg`, 'mobile'],
      ['Mobile checklists', `${CM}/06-workflows-checklists.jpg`, 'mobile'],
      ['Mobile checklist detail', `${CM}/06-workflows-checklist-detail.jpg`, 'mobile'],
      ['Mobile templates', `${CM}/06-workflows-templates.jpg`, 'mobile'],
      ['Mobile support', `${CM}/07-support-tickets.jpg`, 'mobile'],
      ['Mobile ticket preview', `${CM}/07-support-ticket-preview.jpg`, 'mobile'],
      ['Mobile vault', `${CM}/08-vault-logins.jpg`, 'mobile'],
      ['Mobile login detail', `${CM}/08-vault-login-detail.jpg`, 'mobile'],
      ['Mobile vault empty', `${CM}/08-vault-empty.jpg`, 'mobile'],
      ['Mobile Ops Inbox', `${CM}/09-ops-inbox-list.jpg`, 'mobile'],
      ['Mobile Ops Inbox detail', `${CM}/09-ops-inbox-detail.jpg`, 'mobile'],
    ],
  },
  {
    slug: 'bites-by-sweden',
    cover: 0,
    pages: [
      ['Landing page', 'Portfolio - Booked To Play/Bites By Sweden - PDP and LP/Bites By Sweden - Landing Page.jpg', 'desktop'],
      ['Product page, Sour Mix', 'Portfolio - Booked To Play/Bites By Sweden - PDP and LP/Product Page - Sour Mix.jpg', 'desktop'],
    ],
  },
  {
    slug: 'data-flow',
    cover: 4,
    pages: [
      ['About Us', `${WD}/Data Flow/Data Flow - About Us.jpg`, 'desktop'],
      ['Blog', `${WD}/Data Flow/Data Flow - Blog.jpg`, 'desktop'],
      ['GHL', `${WD}/Data Flow/Data Flow - GHL.jpg`, 'desktop'],
      ['HaloPSA', `${WD}/Data Flow/Data Flow - HaloPSA.jpg`, 'desktop'],
      ['Homepage', `${WD}/Data Flow/Data Flow - Homepage.jpg`, 'desktop'],
      ['Webinar', `${WD}/Data Flow/Data Flow - Webinar 3.jpg`, 'desktop'],
      ['Contact Us', `${WD}/Data Flow/Data Flow -Contact Us.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'hidden-power',
    cover: 2,
    pages: [
      ['About Us', `${WD}/Hidden Power/Hidden Power Co - About Us Page.jpg`, 'desktop'],
      ['Contact', `${WD}/Hidden Power/Hidden Power Co - Contact Page.jpg`, 'desktop'],
      ['Home', `${WD}/Hidden Power/Hidden Power Co - Home Page Final.jpg`, 'desktop'],
      ['Installation', `${WD}/Hidden Power/Hidden Power Co - Installation Page (1).jpg`, 'desktop'],
      ['Product page', `${WD}/Hidden Power/Hidden Power Co - Product Inner Page.jpg`, 'desktop'],
      ['Shop', `${WD}/Hidden Power/Hidden Power Co - Shop Page (1).jpg`, 'desktop'],
      ['Warranty', `${WD}/Hidden Power/Hidden Power Co - Warranty Page.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'lkf',
    cover: 2,
    pages: [
      ['About Us', `${WD}/LKF/LKF - About Us.jpg`, 'desktop'],
      ['Get Involved', `${WD}/LKF/LKF - Get Involved.jpg`, 'desktop'],
      ['Home', `${WD}/LKF/LKF - Home Page.jpg`, 'desktop'],
      ['News and Updates', `${WD}/LKF/LKF - News & Upadtes.jpg`, 'desktop'],
      ['Our Impact', `${WD}/LKF/LKF - Our Impact.jpg`, 'desktop'],
      ['Our Programs', `${WD}/LKF/LKF - Our Programs.jpg`, 'desktop'],
      ['Partners', `${WD}/LKF/LKF - Partners.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'pearl-farm',
    cover: 1,
    pages: [
      ['Experiences', `${WD}/Pearl Farm/Experiences.jpg`, 'desktop'],
      ['Homepage', `${WD}/Pearl Farm/Homepage.jpg`, 'desktop'],
      ['Meetings and Events', `${WD}/Pearl Farm/Meetings & Events.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'black-flame-doctrine',
    cover: 2,
    pages: [
      ['About', `${WD}/The Black Flame Doctrine/The Black Flame Doctrine - About.jpg`, 'desktop'],
      ['Coaching', `${WD}/The Black Flame Doctrine/The Black Flame Doctrine - Coaching.jpg`, 'desktop'],
      ['Homepage', `${WD}/The Black Flame Doctrine/The Black Flame Doctrine - Homepage V2.jpg`, 'desktop'],
      ['Speaking and Media', `${WD}/The Black Flame Doctrine/The Black Flame Doctrine - Speaking and Media.jpg`, 'desktop'],
      ['The Doctrine', `${WD}/The Black Flame Doctrine/The Black Flame Doctrine - The Doctrine.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'rc-financial',
    cover: 2,
    pages: [
      ['About Us', `${WD}/RandC Financial/About Us.jpg`, 'desktop'],
      ['Contact Us', `${WD}/RandC Financial/Contact US.jpg`, 'desktop'],
      ['Website', `${WD}/RandC Financial/R&C Financial Website.jpg`, 'desktop'],
      ['Services', `${WD}/RandC Financial/Services (1).jpg`, 'desktop'],
    ],
  },
  {
    slug: 'behind-the-logo',
    cover: 0,
    pages: [
      ['Behind The Logo', `${WD}/Behind The Logo/Behind The Logo.jpg`, 'desktop'],
      ['Contact Us template', `${WD}/Behind The Logo/Contact Us Template.jpg`, 'desktop'],
      ['Services, branding', `${WD}/Behind The Logo/Services Branding (1).jpg`, 'desktop'],
      ['Services, website design', `${WD}/Behind The Logo/Services Website Design.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'more-websites',
    cover: 0,
    pages: [
      ['Whitehall and Associates', `${WD}/White Hall & Associates/Whitehall & Associates (1).jpg`, 'desktop'],
      ['Wilderness Redefined', `${WD}/Wilderness Redefined/Wilderness Redefined Homepage.jpg`, 'desktop'],
    ],
  },
  {
    slug: 'brand-and-social',
    cover: 0,
    pages: [
      ['Social: general announcement', `${WD}/Social Media Ads/GENERAL ANNOUNCEMENT V2.jpg`, 'square'],
      ['Social: join our team', `${WD}/Social Media Ads/Join Our Team!.jpg`, 'square'],
      ['Social: project update', `${WD}/Social Media Ads/PROJECT UPDATE.jpg`, 'square'],
      ['Social: unlimited', `${WD}/Social Media Ads/unlimited 298.png`, 'square'],
      ['Logo: DataFlow', `${WD}/Logo Design/DataFlow-logo.jpg`, 'square'],
      ['Logo: Discover Davao', `${WD}/Logo Design/Discover-Davao-Logo.jpg`, 'square'],
      ['Logo: Show Tel', `${WD}/Logo Design/Show-Tel-Blue-3.jpg`, 'square'],
      ['Logo: children\u2019s ministry', `${WD}/Logo Design/childrens-ministry.jpg`, 'square'],
    ],
  },
]

const slugify = (s) =>
  s.toLowerCase().replace(/[\u2019']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const outRoot = path.join(root, 'public', 'work')
const manifestFile = path.join(root, 'src', 'data', 'images.json')

// Keep what earlier runs produced (and other folders such as public/work/webflow).
// Only the projects in the list above are rebuilt.
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {}
const only = process.argv[3] ? process.argv[3].split(',') : null // e.g. node scripts/build-images.mjs "" cerebru
for (const p of projects) {
  if (only && !only.includes(p.slug)) continue
  const dir = path.join(outRoot, p.slug)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const entry = { cover: null, pages: [] }
  let i = 0
  for (const [label, rel, kind, opts] of p.pages) {
    const src = path.isAbsolute(rel) ? rel : path.join(SRC, rel)
    if (!fs.existsSync(src)) throw new Error('Missing source: ' + src)
    // WebP cannot be taller than 16,383px, so very long pages are written as JPEG instead.
    const jpeg = opts?.format === 'jpeg'
    const name = `${String(i + 1).padStart(2, '0')}-${slugify(label)}.${jpeg ? 'jpg' : 'webp'}`
    const img = sharp(src, { limitInputPixels: false })
    const meta = await img.metadata()
    const width = kind === 'mobile' ? Math.min(meta.width, 440) : kind === 'square' ? 900 : 1200
    const resized = sharp(src, { limitInputPixels: false }).resize({ width, withoutEnlargement: true })
    const info = await (jpeg
      ? resized.jpeg({ quality: 72, mozjpeg: true })
      : resized.webp({ quality: kind === 'mobile' ? 82 : 76 })
    ).toFile(path.join(dir, name))
    entry.pages.push({ label, kind, src: `/work/${p.slug}/${name}`, w: info.width, h: info.height })
    if (i === p.cover) {
      const cw = meta.width
      const ch = kind === 'square' ? meta.height : Math.min(meta.height, Math.round(cw * 0.625))
      let region = { left: 0, top: 0, width: cw, height: ch }
      if (p.coverCrop) {
        const k = meta.width / 1200
        const [cl, ct, cwid, chei] = p.coverCrop
        region = { left: Math.round(cl * k), top: Math.round(ct * k), width: Math.round(cwid * k), height: Math.round(chei * k) }
      }
      const cinfo = await sharp(src, { limitInputPixels: false })
        .extract(region)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 74 })
        .toFile(path.join(dir, 'cover.webp'))
      entry.cover = { src: `/work/${p.slug}/cover.webp`, w: cinfo.width, h: cinfo.height }
    }
    i++
  }
  manifest[p.slug] = entry
  console.log(p.slug, entry.pages.length, 'images')
}

fs.mkdirSync(path.join(root, 'src', 'data'), { recursive: true })
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))

let total = 0
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const fp = path.join(d, f)
    fs.statSync(fp).isDirectory() ? walk(fp) : (total += fs.statSync(fp).size)
  }
}
walk(outRoot)
console.log('Total output:', (total / 1e6).toFixed(1), 'MB')
