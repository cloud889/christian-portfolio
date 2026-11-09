import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { bars, certificates, toolbox } from '../data/profile'

export default function Skills() {
  const { mode } = useMotion()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || mode === 'off') return
    const ctx = gsap.context(() => {
      gsap.from('.bar .fill', {
        scaleX: 0.04,
        duration: 1.3,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%' },
      })
    }, el)
    return () => ctx.revert()
  }, [mode])

  return (
    <div className="two" ref={ref}>
      <div className="panel">
        <h3>Mastery</h3>
        {bars.map((b) => (
          <div className="bar" key={b.label} style={{ '--c': b.color } as CSSProperties}>
            <div>
              <span>{b.label}</span>
              <span className="chip">{b.note}</span>
            </div>
            <div className="t">
              <i className="fill" style={{ transform: `scaleX(${b.value})` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Toolbox</h3>
        <div className="chips lg">
          {toolbox.map((t) => (
            <span key={t.name} className={`chip${t.hot ? ' hot' : ''}`}>
              {t.name}
            </span>
          ))}
        </div>
        <div className="certs">
          {certificates.map((c) => (
            <div className="cert" key={c}>
              {c} <em>ON FILE</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
