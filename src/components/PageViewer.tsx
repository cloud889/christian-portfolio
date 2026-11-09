import { useEffect, useRef, useState } from 'react'
import type { Page } from '../data/projects'

type Props = { name: string; pages: Page[] }

/** Desktop pages in a browser frame with tabs, mobile screens in phone frames, artwork in a grid. */
export default function PageViewer({ name, pages }: Props) {
  const desktop = pages.filter((p) => p.kind === 'desktop')
  const mobile = pages.filter((p) => p.kind === 'mobile')
  const square = pages.filter((p) => p.kind === 'square')
  const [index, setIndex] = useState(0)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    frame.current?.scrollTo({ top: 0 })
  }, [index])

  const current = desktop[index]

  return (
    <div className="viewer">
      {current && (
        <div>
          <h3 className="label">Desktop pages</h3>
          <div className="tabs" role="tablist" aria-label="Desktop pages">
            {desktop.map((p, i) => (
              <button key={p.src} role="tab" aria-selected={i === index} onClick={() => setIndex(i)}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="browser">
            <div className="bar">
              <i />
              <i />
              <i />
              <span>{current.label}</span>
            </div>
            <div className="scroll" ref={frame} tabIndex={0} aria-label={`${name}, ${current.label}. Scroll to see the full page.`}>
              <img key={current.src} src={current.src} width={current.w} height={current.h} alt={`${name} ${current.label} page design`} decoding="async" />
            </div>
          </div>
        </div>
      )}

      {mobile.length > 0 && (
        <div>
          <h3 className="label">Mobile screens</h3>
          <div className="phones">
            {mobile.map((p) => (
              <figure className="phone" key={p.src}>
                <div className="scroll" tabIndex={0} aria-label={`${p.label}. Scroll to see the full screen.`}>
                  <img src={p.src} width={p.w} height={p.h} alt={`${name} ${p.label} screen design`} loading="lazy" decoding="async" />
                </div>
                <figcaption>{p.label.replace('Mobile ', '')}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {square.length > 0 && (
        <div>
          <h3 className="label">Artwork</h3>
          <div className="art">
            {square.map((p) => (
              <figure key={p.src}>
                <img src={p.src} width={p.w} height={p.h} alt={`${name}: ${p.label}`} loading="lazy" decoding="async" />
                <figcaption>{p.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
