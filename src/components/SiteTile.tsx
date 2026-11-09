import type { Site } from '../data/projects'
import Icon from './Icon'

/** A live Webflow site: browser frame with the homepage, what was done, and a link out. */
export default function SiteTile({ site, size }: { site: Site; size: 'lg' | 'md' }) {
  return (
    <a className={`site ${size}`} href={site.href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name}, ${site.role} Opens ${site.host} in a new tab.`}>
      <div className="frame">
        <div className="fbar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{site.host}</span>
        </div>
        {site.shot && <img src={site.shot} width={1000} height={660} alt="" loading="lazy" decoding="async" />}
      </div>
      <div className="sinfo">
        <div>
          <h4>{site.name}</h4>
          <p>{site.role}</p>
        </div>
        <Icon name="arrow_outward" className="go" />
      </div>
      <div className="chips">
        {site.tags.map((t, i) => (
          <span key={t} className={`chip${i === 0 ? ' hot' : ''}`}>
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}
