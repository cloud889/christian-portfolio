import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import type { Project } from '../data/projects'
import PageViewer from './PageViewer'
import PinStory from './PinStory'

type Props = { project: Project; origin: DOMRect; onClose: () => void }

const target = () => {
  const w = Math.min(1040, window.innerWidth - 32)
  return { left: (window.innerWidth - w) / 2, top: 24, width: w, height: window.innerHeight - 48 }
}

/** Case study that grows out of the card that was clicked and shrinks back into it on close. */
export default function CaseSheet({ project, origin, onClose }: Props) {
  const { mode } = useMotion()
  const overlay = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)

  useLayoutEffect(() => {
    const el = sheet.current
    const ov = overlay.current
    if (!el || !ov) return
    const t = target()
    // A context restores the original styles on cleanup, so React StrictMode's double
    // effect run does not leave a half-finished tween as the "end" state of the next one.
    const ctx = gsap.context(() => {
      if (mode !== 'off') {
        gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        gsap.fromTo(
          el,
          { left: origin.left, top: origin.top, width: origin.width, height: origin.height },
          { ...t, duration: 0.75, ease: 'expo.inOut' },
        )
        gsap.from(el.querySelectorAll('.sheet-in > .rise'), {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.45,
          ease: 'power3.out',
        })
      } else {
        gsap.set(el, t)
      }
    }, ov)
    const previous = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = ''
      ctx.revert()
      previous?.focus?.()
    }
    // Runs once per open; mode changes while open should not replay the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const el = sheet.current
    const ov = overlay.current
    if (mode !== 'off' && el && ov) {
      gsap.to(el, { left: origin.left, top: origin.top, width: origin.width, height: origin.height, duration: 0.55, ease: 'expo.inOut' })
      gsap.to(ov, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: onClose })
    } else {
      onClose()
    }
  }, [mode, origin, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onResize = () => {
      if (!sheet.current || closing.current) return
      gsap.set(sheet.current, target())
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [close])

  return (
    <div
      className="ov"
      ref={overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="sheet" ref={sheet} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <button ref={closeButton} className="x" onClick={close}>
          Close
        </button>
        <div className="sheet-in" ref={scroller}>
          <div className="rise">
            <div className="chips">
              {project.tags.map((t, i) => (
                <span key={t} className={`chip${i === 0 ? ' hot' : ''}`}>
                  {t}
                </span>
              ))}
            </div>
            <h2 id="sheet-title">{project.name}</h2>
            <p className="sub">{project.blurb}</p>
          </div>

          {project.story && (
            <div className="rise">
              <PinStory project={project} scroller={scroller} />
            </div>
          )}

          <div className="rise cols">
            <div>
              <h3>What it shows</h3>
              <ul>
                {project.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            {project.links && (
              <div>
                <h3>Live sites</h3>
                <ul>
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                      <small>{l.note}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {project.pages.length > 0 && (
            <div className="rise">
              <PageViewer name={project.name} pages={project.pages} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
