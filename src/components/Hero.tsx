import { useEffect, useState } from 'react'
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
  return (
    <section id="overview" className="hero">
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
