import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { screenCount, type Project } from '../data/projects'

export function CardPins({ pins }: { pins: { x: number; y: number }[] }) {
  const { mode } = useMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || mode === 'off') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mode])

  return (
    <div ref={ref} className={`cpins${seen ? ' pop' : ''}`} aria-hidden="true">
      {pins.map((p, i) => (
        <span key={i} className="cpin" style={{ left: `${p.x}%`, top: `${p.y}%`, ['--d' as string]: i }}>
          {i + 1}
        </span>
      ))}
    </div>
  )
}

type Props = { project: Project; onOpen: (project: Project, rect: DOMRect) => void }

export default function ProjectCard({ project, onOpen }: Props) {
  const { mode } = useMotion()
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (mode !== 'led' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    gsap.to(ref.current, { rotateX: (py - 0.5) * -5, rotateY: (px - 0.5) * 5, transformPerspective: 900, duration: 0.35, overwrite: 'auto' })
  }
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.5 })
  }

  return (
    <button
      ref={ref}
      className={`card${project.featured ? ' big' : ''}`}
      onClick={(e) => onOpen(project, e.currentTarget.getBoundingClientRect())}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Open ${project.name}`}
    >
      <div className="thumb">
        {project.cover ? (
          <img src={project.cover.src} width={project.cover.w} height={project.cover.h} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="linkcover">
            {(project.links ?? []).slice(0, 6).map((l) => (
              <span key={l.href}>{l.label}</span>
            ))}
          </div>
        )}
        {project.cardPins && <CardPins pins={project.cardPins} />}
      </div>
      <div className="meta">
        <span>{project.kind}</span>
        <span>{screenCount(project)}</span>
      </div>
      <h4>{project.name}</h4>
      <div className="chips">
        {project.tags.map((t, i) => (
          <span key={t} className={`chip${i === 0 ? ' hot' : ''}`}>
            {t}
          </span>
        ))}
        {project.story && <span className="chip pinchip">{project.story.pins.length} pinned notes</span>}
      </div>
    </button>
  )
}
