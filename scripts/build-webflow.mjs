// Converts screenshots (hero, cropped to 1000x660) of the live Webflow sites into WebP for the Projects section.
// Usage: node scripts/build-webflow.mjs <folder with <slug>.png files>
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const src = process.argv[2]
if (!src) throw new Error('Pass the folder that holds the screenshots')
// Optional second argument rebuilds only some slugs: node scripts/build-webflow.mjs <folder> lampliter,goldenbroom
const all = ['tatum', 'silverbullet', 'alpine', 'spx', 'pghrcs', 'vtj', 'nxg', 'lampliter', 'goldenbroom', 'tca-parkville', 'tca-denver', 'intheweeds']
const slugs = process.argv[3] ? process.argv[3].split(',') : all
const out = join(import.meta.dirname, '..', 'public', 'work', 'webflow')
mkdirSync(out, { recursive: true })

for (const slug of slugs) {
  const info = await sharp(join(src, `${slug}.png`)).resize({ width: 1000, height: 660, fit: 'cover', position: 'top' }).webp({ quality: 74 }).toFile(join(out, `${slug}.webp`))
  console.log(slug, info.width, info.height, Math.round(info.size / 1024) + ' KB')
}
