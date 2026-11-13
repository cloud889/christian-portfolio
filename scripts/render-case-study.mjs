// Renders a case-study HTML page to one tall PNG with headless Chrome, so it can be shown in the
// portfolio's page viewer the same way the BookedToPlay case study is.
// Chrome cannot capture more than about 16,000px in one go (the picture wraps around), so the page is
// captured in chunks and stitched together.
// Usage: node scripts/render-case-study.mjs <path to index.html> <output.png> [width=1440]
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const [htmlArg, outArg, widthArg] = process.argv.slice(2)
if (!htmlArg || !outArg) {
  console.error('Usage: node scripts/render-case-study.mjs <index.html> <output.png> [width]')
  process.exit(1)
}
const html = path.resolve(htmlArg)
const out = path.resolve(outArg)
const width = Number(widthArg) || 1440
const CHUNK = Number(process.env.CHUNK) || 6000
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const tmpDir = path.join(here, '.render')
fs.mkdirSync(tmpDir, { recursive: true })
fs.mkdirSync(path.dirname(out), { recursive: true })

// A copy of the page with a <base> so its relative images still load, a script that reports the page
// height, and (for ?y=<pixels>) a shift that moves the page up so that slice starts at the top of the
// capture. Scrolling is not used: scrolled headless captures come out blank.
const base = pathToFileURL(path.dirname(html) + path.sep).href
let src = fs.readFileSync(html, 'utf8')
src = src.replace(
  '<head>',
  `<head><base href="${base}"><script>
    const y = Number(new URLSearchParams(location.search).get('y')) || 0
    if (y) { document.documentElement.style.position = 'relative'; document.documentElement.style.top = -y + 'px' }
  </script>`,
)
src = src.replace(
  '</body>',
  `<script>
    addEventListener('load', () => {
      setTimeout(() => document.body.setAttribute('data-h', String(document.documentElement.scrollHeight)), 2500)
    })
  </script></body>`,
)
const probe = path.join(tmpDir, 'probe.html')
fs.writeFileSync(probe, src)
const probeUrl = (y = 0) => pathToFileURL(probe).href + (y ? `?y=${y}` : '')

const common = ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=15000']
const dom = spawnSync(chrome, [...common, `--window-size=${width},900`, '--dump-dom', probeUrl()], { encoding: 'utf8', maxBuffer: 1 << 28 })
const m = /data-h="(\d+)"/.exec(dom.stdout || '')
if (!m) throw new Error('Could not measure the page height')
const height = Number(m[1])
console.log('page height', height)

const parts = []
for (let y = 0; y < height; y += CHUNK) {
  const h = Math.min(CHUNK, height - y)
  const file = path.join(tmpDir, `chunk-${y}.png`)
  fs.rmSync(file, { force: true })
  spawnSync(chrome, [...common, `--window-size=${width},${h}`, `--screenshot=${file}`, probeUrl(y)], { encoding: 'utf8' })
  if (!fs.existsSync(file)) throw new Error('Capture failed at ' + y)
  parts.push({ input: file, top: y, left: 0 })
}

await sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
  .composite(parts)
  .png()
  .toFile(out)
parts.forEach((p) => fs.rmSync(p.input, { force: true }))
console.log('wrote', out)
