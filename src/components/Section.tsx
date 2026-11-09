import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'

type Props = { id: string; title: string; aside?: string; reveal?: boolean; children: ReactNode }

/** Section with a heading row. Children fade and rise in as the section scrolls into view. */
export default function Section({ id, title, aside, reveal = true, children }: Props) {
  const { mode } = useMotion()
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !reveal || mode === 'off') return
    const ctx = gsap.context(() => {
      gsap.from(Array.from(el.children), {
        y: 26,
        opacity: 0.3,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    }, el)
    return () => ctx.revert()
  }, [mode, reveal])

  return (
    <section id={id} ref={ref}>
      <div className="sh">
        <h2>{title}</h2>
        {aside && <span>{aside}</span>}
      </div>
      {children}
    </section>
  )
}
