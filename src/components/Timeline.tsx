import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { timeline } from '../data/profile'

export default function Timeline() {
  const { mode } = useMotion()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || mode === 'off') return
    const ctx = gsap.context(() => {
      gsap.from('.tl-line', {
        scaleY: 0.06,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 70%', scrub: true },
      })
      gsap.from('.tl-i', {
        x: -14,
        opacity: 0.3,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 75%' },
      })
    }, el)
    return () => ctx.revert()
  }, [mode])

  return (
    <div className="panel" ref={ref}>
      <div className="tl">
        <div className="tl-line" />
        {timeline.map((t) => (
          <div className="tl-i" key={t.title + t.meta}>
            <b>{t.title}</b>
            <span>{t.meta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
