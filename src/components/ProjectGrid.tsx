import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../lib/motion-mode'
import { caseStudies as caseSlugs, projects, sites, webflowCount, type Project } from '../data/projects'
import ProjectCard, { CardPins } from './ProjectCard'
import SiteTile from './SiteTile'
import Icon from './Icon'

type Props = { onOpen: (project: Project, rect: DOMRect) => void }

const bySite = (kind: string) => sites.filter((s) => s.kind === kind)

/** Projects: Webflow development first and largest, then the UX/UI case study, then the design archive. */
export default function ProjectGrid({ onOpen }: Props) {
  const { mode } = useMotion()
  const ref = useRef<HTMLDivElement>(null)

  const cases = caseSlugs.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => Boolean(p))
  const archive = projects.filter((p) => p.cover && !caseSlugs.includes(p.slug))

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || mode === 'off') return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.site, .case, .card').forEach((t) => {
        gsap.from(t, {
          y: 36,
          opacity: 0.2,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: t, start: 'top 92%' },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [mode])

  return (
    <div className="pgroups" ref={ref}>
      <div className="grp" id="works-web">
        <h3>
          <Icon name="code" />
          Webflow development
        </h3>
        <p>
          {webflowCount} live sites I designed, built or migrated. Each one opens the real site.
        </p>
      </div>

      <h4 className="tier">
        <span>Designed and built</span>
        <i />
      </h4>
      <div className="sites">
        {bySite('design-build').map((s) => (
          <SiteTile key={s.href} site={s} size="lg" />
        ))}
      </div>

      <h4 className="tier">
        <span>Migrated from WordPress</span>
        <i />
      </h4>
      <div className="sites">
        {bySite('migration').map((s) => (
          <SiteTile key={s.href} site={s} size="lg" />
        ))}
      </div>

      <h4 className="tier">
        <span>More Webflow builds</span>
        <i />
      </h4>
      <div className="sites">
        {bySite('sample').map((s) => (
          <SiteTile key={s.href} site={s} size="md" />
        ))}
      </div>

      <h4 className="tier">
        <span>Also built in WordPress</span>
        <i />
      </h4>
      <div className="wp">
        {bySite('wordpress').map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
            <span>
              <b>{s.name}</b>
              <small>{s.host}</small>
            </span>
            <Icon name="arrow_outward" className="go" />
          </a>
        ))}
      </div>

      {cases.length > 0 && (
        <>
          <hr className="grp-hr" />
          <div className="grp quiet" id="works-ux">
            <h3>
              <Icon name="draw" />
              UX/UI design
            </h3>
            <p>{cases.length} full case studies. This is design work, not development.</p>
          </div>
          <div className="cases">
            {cases.map((c) => (
              <button
                key={c.slug}
                id={`case-${c.slug}`}
                className="case"
                onClick={(e) => onOpen(c, e.currentTarget.getBoundingClientRect())}
                aria-label={`Open ${c.name} case study`}
              >
                <div className="thumb">
                  {c.cover && <img src={c.cover.src} width={c.cover.w} height={c.cover.h} alt="" loading="lazy" decoding="async" />}
                  {c.cardPins && <CardPins pins={c.cardPins} />}
                </div>
                <div className="cbody">
                  <h4>{c.name}</h4>
                  <p>{c.blurb}</p>
                  <ul>
                    {c.facts.slice(0, 3).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="chips">
                    {c.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                    {c.story && <span className="chip pinchip">{c.story.pins.length} pinned notes</span>}
                  </div>
                  <span className="open">
                    Open case study <Icon name="arrow_outward" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {archive.length > 0 && (
        <>
          <hr className="grp-hr" />
          <div className="grp quiet">
            <h3>
              <Icon name="brush" />
              More design work
            </h3>
            <p>Website page designs and brand graphics. Open one to see every screen.</p>
          </div>
          <div className="grid">
            {archive.map((p) => (
              <ProjectCard key={p.slug} project={p} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
