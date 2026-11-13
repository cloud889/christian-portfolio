import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion, type Mode } from '../lib/motion-mode'
import { profile } from '../data/profile'
import { caseStudies, webflowCount } from '../data/projects'
import Icon from './Icon'

type Item = { id: string; label: string; icon: string; count?: string }

const BEFORE: Item[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder_open' },
]
/** Jump links inside Projects. The ids sit on the group headings in ProjectGrid. */
const WORKS: Item[] = [
  { id: 'works-web', label: 'Web', icon: 'code', count: String(webflowCount).padStart(2, '0') },
  { id: 'works-ux', label: 'UX/UI', icon: 'draw', count: String(caseStudies.length).padStart(2, '0') },
]
const AFTER: Item[] = [
  { id: 'skills', label: 'Stack', icon: 'layers' },
  { id: 'timeline', label: 'History', icon: 'history' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
]
const ORDER = [...BEFORE, ...WORKS, ...AFTER].map((n) => n.id)
const MAIN = [...BEFORE, ...AFTER]

const MODES: { value: Mode; label: string }[] = [
  { value: 'led', label: 'Led' },
  { value: 'balanced', label: 'Mid' },
  { value: 'off', label: 'Off' },
]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function Sidebar({ projectCount }: { projectCount: number }) {
  const { mode, setMode, replay } = useMotion()
  const [current, setCurrent] = useState('overview')
  const side = useRef<HTMLElement>(null)
  const nav = useRef<HTMLElement>(null)
  const ind = useRef<HTMLSpanElement>(null)
  const scrollTween = useRef<gsap.core.Tween | null>(null)
  /** Until this time (ms) the highlight stays on the jump target instead of following the scroll. */
  const jumpUntil = useRef(0)
  const placed = useRef(false)

  // Which section is under the reading line. Paused while a jump animation runs, so the
  // highlight lands on the target instead of flickering through everything in between.
  // (If the visitor scrolls by hand mid-jump, GSAP stops the tween and this resumes.)
  useEffect(() => {
    let raf = 0
    let retry = 0
    const compute = () => {
      raf = 0
      if (performance.now() < jumpUntil.current) {
        window.clearTimeout(retry)
        retry = window.setTimeout(onScroll, 200)
        return
      }
      const line = window.innerHeight * 0.38
      let cur = ORDER[0]
      for (const id of ORDER) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) cur = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact'
      setCurrent(cur)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    // The visitor took over (wheel, touch, keys, scrollbar): GSAP stops its tween, so stop holding the highlight.
    const takeOver = () => {
      jumpUntil.current = 0
      onScroll()
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('load', onScroll)
    window.addEventListener('wheel', takeOver, { passive: true })
    window.addEventListener('touchstart', takeOver, { passive: true })
    window.addEventListener('keydown', takeOver)
    window.addEventListener('pointerdown', takeOver)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('load', onScroll)
      window.removeEventListener('wheel', takeOver)
      window.removeEventListener('touchstart', takeOver)
      window.removeEventListener('keydown', takeOver)
      window.removeEventListener('pointerdown', takeOver)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(retry)
    }
  }, [])

  // The ice bar slides to the active link.
  useLayoutEffect(() => {
    const bar = ind.current
    const link = nav.current?.querySelector<HTMLAnchorElement>(`a[data-id="${current}"]`)
    if (!bar || !link) return
    const to = { y: link.offsetTop, height: link.offsetHeight, opacity: 1 }
    if (!placed.current || mode === 'off') gsap.set(bar, to)
    else gsap.to(bar, { ...to, duration: 0.6, ease: 'expo.out', overwrite: true })
    placed.current = true
    // On phones the nav is a scrolling row: keep the active link in view.
    const s = side.current
    if (s && window.matchMedia('(max-width: 860px)').matches) {
      s.scrollTo({ left: link.offsetLeft - s.clientWidth / 2 + link.offsetWidth / 2, behavior: mode === 'off' ? 'auto' : 'smooth' })
    }
  }, [current, mode])

  useEffect(() => {
    const el = nav.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const bar = ind.current
      const link = el.querySelector<HTMLAnchorElement>(`a[data-id="${current}"]`)
      if (bar && link) gsap.set(bar, { y: link.offsetTop, height: link.offsetHeight })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [current])

  useEffect(() => () => void scrollTween.current?.kill(), [])

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    setCurrent(id)
    history.replaceState(null, '', `#${id}`)

    const phone = window.matchMedia('(max-width: 860px)').matches
    const offset = phone ? (side.current?.offsetHeight ?? 0) + 14 : 24
    // Overview means the very top of the page, including the breadcrumb bar above the hero.
    const targetY = () => (id === 'overview' ? 0 : el.getBoundingClientRect().top + window.scrollY - offset)
    const root = document.documentElement
    scrollTween.current?.kill()

    // Mark the heading that was jumped to so the eye finds it.
    const land = () => {
      if (mode === 'off') return
      const mark = el.matches('section') ? (el.querySelector<HTMLElement>('.sh h2') ?? el) : el
      mark.classList.remove('landed')
      void mark.offsetWidth
      mark.classList.add('landed')
      window.setTimeout(() => mark.classList.remove('landed'), 1400)
    }

    // The inline override is removed again after the jump, so the CSS rules (smooth, or auto
    // when motion is Off) apply to everything else on the page.
    const release = () => requestAnimationFrame(() => (root.style.scrollBehavior = ''))

    if (mode === 'off') {
      root.style.scrollBehavior = ''
      window.scrollTo({ top: targetY(), behavior: 'instant' })
      return
    }

    root.style.scrollBehavior = 'auto' // CSS smooth scrolling restarts on every tween frame and the page never moves
    const finish = () => {
      jumpUntil.current = 0
      release()
      land()
    }
    const distance = Math.abs(targetY() - window.scrollY)
    const duration = clamp(distance / 2200, 0.7, 1.5)
    jumpUntil.current = performance.now() + (duration + 0.8) * 1000
    scrollTween.current = gsap.to(window, {
      scrollTo: { y: targetY(), autoKill: true },
      duration,
      ease: 'expo.inOut',
      onComplete: () => {
        // Images that loaded during the trip can shift the page a little: settle on the heading.
        const drift = targetY() - window.scrollY
        if (Math.abs(drift) > 6) {
          scrollTween.current = gsap.to(window, { scrollTo: { y: targetY(), autoKill: true }, duration: 0.35, ease: 'power2.out', onComplete: finish, onInterrupt: finish })
        } else {
          finish()
        }
      },
      onInterrupt: () => {
        jumpUntil.current = 0
        release()
      },
    })
  }

  const link = (n: Item, sub = false) => (
    <a key={n.id} data-id={n.id} href={`#${n.id}`} className={current === n.id ? 'on' : undefined} aria-current={current === n.id ? 'location' : undefined} onClick={(e) => go(e, n.id)}>
      <Icon name={n.icon} />
      <b>{n.label}</b>
      <span>{sub ? n.count : n.id === 'projects' ? projectCount : String(MAIN.findIndex((m) => m.id === n.id) + 1).padStart(2, '0')}</span>
    </a>
  )

  return (
    <aside className="side" ref={side}>
      <div className="brand">
        <div className="mark">CJ</div>
        <span>Gundino</span>
      </div>
      <nav className="nav" aria-label="Sections" ref={nav}>
        <span className="navind" ref={ind} aria-hidden="true" />
        {BEFORE.map((n) => link(n))}
        <div className="subnav" role="group" aria-label="Works">
          <small>Works</small>
          {WORKS.map((n) => link(n, true))}
        </div>
        {AFTER.map((n) => link(n))}
      </nav>
      <div className="sidecontact">
        <small>Contact</small>
        <a href={`mailto:${profile.email}`}>
          <Icon name="mail" />
          {profile.email}
        </a>
        <a href={profile.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Icon name="call" />
          WhatsApp {profile.whatsapp}
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <Icon name="work" />
          LinkedIn profile
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          <Icon name="code" />
          github.com/cloud889
        </a>
        <p>
          <Icon name="location_on" />
          Philippines
        </p>
        <p>
          <Icon name="schedule" />
          {profile.availability}
        </p>
      </div>
      <hr className="sidehr" />
      <div className="dial">
        <small>Motion level</small>
        <div className="seg" role="group" aria-label="Motion level">
          {MODES.map((m) => (
            <button key={m.value} aria-pressed={mode === m.value} onClick={() => setMode(m.value)}>
              {m.label}
            </button>
          ))}
        </div>
        <button className="replay" onClick={replay}>
          Replay intro
        </button>
      </div>
    </aside>
  )
}
