import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { projects, type Project } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ onOpen }: { onOpen: (project: Project, rect: DOMRect) => void }) {
  const { mode } = useMotion()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || mode === 'off') return
    const ctx = gsap.context(() => {
      gsap.from('.card', {
        y: 40,
        opacity: 0.25,
        scale: 0.97,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [mode])

  return (
    <div className="grid" ref={ref}>
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} onOpen={onOpen} />
      ))}
    </div>
  )
}
