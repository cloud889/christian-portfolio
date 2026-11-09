import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from './lib/gsap'
import { MotionProvider, useMotion } from './lib/motion-mode'
import { projects, type Project } from './data/projects'
import { profile } from './data/profile'
import DotGrid from './components/DotGrid'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Section from './components/Section'
import ProjectGrid from './components/ProjectGrid'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import Contact from './components/Contact'
import CaseSheet from './components/CaseSheet'
import CommandPalette from './components/CommandPalette'

type Open = { project: Project; origin: DOMRect }

function Shell() {
  const { mode, introKey, replay } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Open | null>(null)
  const [palette, setPalette] = useState(false)

  // Opening intro. Replays when the "Replay intro" control is used.
  useLayoutEffect(() => {
    if (mode === 'off') return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.eyebrow', { x: -20, opacity: 0, duration: 0.6 })
        .from('.name .ch', { yPercent: 115, duration: 0.9, stagger: 0.03 }, '-=0.3')
        .from('.role, .lead', { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
        .from('.kpi', { y: 26, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.4')
        .from('.ticker', { opacity: 0, duration: 0.6 }, '-=0.3')
    }, root)
    return () => ctx.revert()
  }, [mode, introKey])

  // Images change page height, so recalculate scroll triggers once everything has loaded.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openProject = useCallback((project: Project, origin: DOMRect) => setOpen({ project, origin }), [])
  const closeProject = useCallback(() => setOpen(null), [])

  // From the palette there is no card to grow out of, so grow from the middle of the screen.
  const openFromPalette = useCallback((project: Project) => {
    const w = 240
    const h = 140
    setOpen({ project, origin: new DOMRect(window.innerWidth / 2 - w / 2, window.innerHeight / 2 - h / 2, w, h) })
  }, [])

  return (
    <>
      <DotGrid />
      <div className="shell" ref={root}>
        <Sidebar projectCount={projects.length} />
        <main>
          <div className="top">
            <div className="crumb">
              Portfolio / <b>Overview</b> / 2026
            </div>
            <div className="tools">
              <button className="jump" onClick={() => setPalette(true)} aria-label="Open quick jump">
                Jump to a project <kbd>Ctrl K</kbd>
              </button>
              <div className="live">
                <i />
                {profile.availability}
              </div>
            </div>
          </div>

          <Hero />

          <Section id="projects" title="Projects" aside="Open a project to see the full designs. BookedToPlay has pinned notes." reveal={false}>
            <ProjectGrid onOpen={openProject} />
          </Section>

          <Section id="skills" title="Stack" aside="Experience in years, from the CV and profile">
            <Skills />
          </Section>

          <Section id="timeline" title="History" aside="Newest first">
            <Timeline />
          </Section>

          <Section id="contact" title="Contact" aside={profile.contactLine}>
            <Contact />
          </Section>
        </main>
      </div>

      {open && <CaseSheet key={open.project.slug} project={open.project} origin={open.origin} onClose={closeProject} />}
      {palette && <CommandPalette onClose={() => setPalette(false)} onOpenProject={openFromPalette} onReplay={replay} />}
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Shell />
    </MotionProvider>
  )
}
