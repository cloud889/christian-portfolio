import { useEffect, useState } from 'react'
import { useMotion, type Mode } from '../lib/motion-mode'

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Stack' },
  { id: 'timeline', label: 'History' },
  { id: 'contact', label: 'Contact' },
]

const MODES: { value: Mode; label: string }[] = [
  { value: 'led', label: 'Led' },
  { value: 'balanced', label: 'Mid' },
  { value: 'off', label: 'Off' },
]

export default function Sidebar({ projectCount }: { projectCount: number }) {
  const { mode, setMode, replay } = useMotion()
  const [current, setCurrent] = useState('overview')

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <aside className="side">
      <div className="brand">
        <div className="mark">CJ</div>
        <span>Gundino</span>
      </div>
      <nav className="nav" aria-label="Sections">
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} className={current === n.id ? 'on' : undefined}>
            {n.label}
            <span>{n.id === 'projects' ? projectCount : String(i + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </nav>
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
