import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import type { Project } from '../data/projects'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

type Props = { project: Project; scroller: RefObject<HTMLDivElement | null> }

/**
 * Pinned notes. The page design sits in a sticky browser frame. As the notes scroll past,
 * the camera pans (and zooms, in "led" mode) to the matching pin and that pin pulses.
 */
export default function PinStory({ project, scroller }: Props) {
  const story = project.story
  const page = project.pages.find((p) => p.label === story?.page)
  const { mode } = useMotion()
  const [active, setActive] = useState(0)

  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const pinEls = useRef<(HTMLButtonElement | null)[]>([])
  const noteEls = useRef<(HTMLDivElement | null)[]>([])
  const cam = useRef({ x: 0, y: 0, s: 1 })
  const tween = useRef<gsap.core.Tween | null>(null)
  const activeRef = useRef(0)
  const mounted = useRef(false)

  const pins = useMemo(() => story?.pins ?? [], [story])

  const place = useCallback(() => {
    const vp = viewport.current
    const cv = canvas.current
    if (!vp || !cv || !page) return
    const { x, y, s } = cam.current
    const W = vp.clientWidth
    const H = (W * page.h) / page.w
    cv.style.width = `${W}px`
    cv.style.height = `${H}px`
    cv.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    pins.forEach((p, k) => {
      const el = pinEls.current[k]
      if (!el) return
      const sx = x + s * (p.x / 100) * W
      const sy = y + s * (p.y / 100) * H
      el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`
      el.dataset.side = sx > W * 0.55 ? 'l' : 'r'
    })
  }, [page, pins])

  const focusPin = useCallback(
    (k: number, animate: boolean) => {
      const vp = viewport.current
      const pin = pins[k]
      if (!vp || !pin || !page) return
      const W = vp.clientWidth
      const H = (W * page.h) / page.w
      const VH = vp.clientHeight
      const s = mode === 'led' ? 1.5 : 1
      const tx = clamp(W / 2 - s * (pin.x / 100) * W, W - s * W, 0)
      const ty = clamp(VH / 2 - s * (pin.y / 100) * H, Math.min(0, VH - s * H), 0)
      tween.current?.kill()
      if (animate && mode !== 'off') {
        tween.current = gsap.to(cam.current, { x: tx, y: ty, s, duration: 0.9, ease: 'power3.inOut', onUpdate: place })
      } else {
        cam.current = { x: tx, y: ty, s }
        place()
      }
    },
    [mode, page, pins, place],
  )

  useEffect(() => {
    activeRef.current = active
    focusPin(active, mounted.current)
    mounted.current = true
  }, [active, focusPin])

  useEffect(() => {
    const vp = viewport.current
    if (!vp) return
    const ro = new ResizeObserver(() => focusPin(activeRef.current, false))
    ro.observe(vp)
    return () => {
      ro.disconnect()
      tween.current?.kill()
    }
  }, [focusPin])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let pending = false
    const onScroll = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => {
        pending = false
        const r = el.getBoundingClientRect()
        let mid = r.top + r.height * 0.5
        // On phones the sticky frame covers the top of the sheet, so measure the area below it.
        const stage = viewport.current?.closest('.stage')
        if (stage && window.matchMedia('(max-width: 860px)').matches) {
          mid = (stage.getBoundingClientRect().bottom + r.bottom) / 2
        }
        let best = 0
        let bestDist = Infinity
        noteEls.current.forEach((n, i) => {
          if (!n) return
          const b = n.getBoundingClientRect()
          const d = Math.abs(b.top + b.height / 2 - mid)
          if (d < bestDist) {
            bestDist = d
            best = i
          }
        })
        setActive(best)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scroller])

  if (!story || !page) return null

  const goTo = (k: number) => {
    setActive(k)
    noteEls.current[k]?.scrollIntoView({ behavior: mode === 'off' ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <div className="story">
      <div className="stage">
        <div className="browser">
          <div className="bar">
            <i />
            <i />
            <i />
            <span>
              {project.name} · {page.label}
            </span>
          </div>
          <div className="vp" ref={viewport}>
            <div className="cv" ref={canvas}>
              <img src={page.src} width={page.w} height={page.h} alt={`${project.name} ${page.label} page design`} draggable={false} />
            </div>
            {pins.map((p, k) => (
              <button
                key={p.label}
                ref={(el) => {
                  pinEls.current[k] = el
                }}
                className={`pin${k === active ? ' on' : ''}`}
                onClick={() => goTo(k)}
                aria-label={`Note ${k + 1}: ${p.label}`}
              >
                <b>{k + 1}</b>
                <em>{p.label}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="notes">
        {pins.map((p, k) => (
          <div
            key={p.label}
            className={`note${k === active ? ' on' : ''}`}
            ref={(el) => {
              noteEls.current[k] = el
            }}
            onClick={() => setActive(k)}
          >
            <span className="n">
              NOTE {k + 1} OF {pins.length}
            </span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
