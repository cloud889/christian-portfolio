import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { kpis, profile, ticker, type Kpi } from '../data/profile'

function CountUp({ to }: { to: number }) {
  const { mode, introKey } = useMotion()
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (mode === 'off') {
      setValue(to)
      return
    }
    const state = { v: 0 }
    setValue(0)
    const tween = gsap.to(state, {
      v: to,
      duration: 1.6,
      delay: 0.6,
      ease: 'power2.out',
      onUpdate: () => setValue(Math.round(state.v)),
    })
    return () => {
      tween.kill()
    }
  }, [mode, introKey, to])

  return <span>{value}</span>
}

function KpiTile({ kpi }: { kpi: Kpi }) {
  return (
    <div className={`kpi${kpi.primary ? ' primary' : ''}`}>
      <div className="num">
        <CountUp to={kpi.value} />
        {kpi.suffix && <sup>{kpi.suffix}</sup>}
      </div>
      <p>{kpi.label}</p>
    </div>
  )
}

export default function Hero() {
  const words = profile.name.split(' ')
  const { mode } = useMotion()
  const portrait = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = portrait.current
    return () => { if (node) gsap.killTweensOf(node) }
  }, [mode])

  function movePortrait(event: PointerEvent<HTMLDivElement>) {
    if (mode !== 'led' || event.pointerType !== 'mouse' || !portrait.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    gsap.to(portrait.current, {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 12,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
      rotate: ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.5,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  function resetPortrait() {
    if (portrait.current) gsap.to(portrait.current, { x: 0, y: 0, rotate: 0, duration: 0.8, overwrite: 'auto' })
  }

  return (
    <section id="overview" className="hero">
      <div className="hero-intro">
      <div className="hero-copy">
      <div className="eyebrow">{profile.eyebrow}</div>
      <h1 className="name" aria-label={profile.name}>
        {words.map((word) => (
          <span className="w" key={word} aria-hidden="true">
            {word.split('').map((ch, i) => (
              <span className="ch" key={i}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="role">{profile.role}</p>
      <p className="lead">{profile.lead}</p>
      </div>
      <div className="hero-portrait" onPointerMove={movePortrait} onPointerLeave={resetPortrait}>
        <div className="hero-portrait-motion" ref={portrait}>
          <img src="/images/christian-hero.png" alt="Christian John Gundino smiling" width="1024" height="1024" fetchPriority="high" draggable={false} />
        </div>
      </div>
      </div>
      <div className="kpis">
        {kpis.map((k) => (
          <KpiTile key={k.label} kpi={k} />
        ))}
      </div>
      <div className="ticker" aria-hidden="true">
        <div>
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
