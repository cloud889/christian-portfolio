import { useEffect, useState } from 'react'
import { useMotion, type Mode } from '../lib/motion-mode'
import { profile } from '../data/profile'
import Icon from './Icon'

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder_open' },
  { id: 'skills', label: 'Stack', icon: 'layers' },
  { id: 'timeline', label: 'History', icon: 'history' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
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
            <Icon name={n.icon} />
            <b>{n.label}</b>
            <span>{n.id === 'projects' ? projectCount : String(i + 1).padStart(2, '0')}</span>
          </a>
        ))}
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
