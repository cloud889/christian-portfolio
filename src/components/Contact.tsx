import { useRef, useState } from 'react'
import { profile } from '../data/profile'
import Icon from './Icon'

export default function Contact() {
  const text = useRef<HTMLAnchorElement>(null)
  const [label, setLabel] = useState('Copy')

  const flash = (next: string) => {
    setLabel(next)
    window.setTimeout(() => setLabel('Copy'), 1500)
  }

  const selectText = () => {
    if (!text.current) return
    const range = document.createRange()
    range.selectNodeContents(text.current)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    flash('Selected')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      flash('Copied')
    } catch {
      selectText()
    }
  }

  return (
    <div className="contact">
      <div className="cintro">
        <h2>Have a site that needs to work harder?</h2>
        <p>Tell me what it should do and I'll show you how I'd build it.</p>
        <div className="live">
          <i />
          {profile.availability}
        </div>
      </div>
      <div className="mails">
        <div className="crow">
          <Icon name="mail" />
          <div className="ctext">
            <small>Email</small>
            <a ref={text} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <button className="cact" onClick={copy}>
            {label}
          </button>
        </div>
        <a className="crow" href={profile.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Icon name="call" />
          <div className="ctext">
            <small>WhatsApp</small>
            <span>{profile.whatsapp}</span>
          </div>
          <span className="cact">
            Message <Icon name="arrow_outward" />
          </span>
        </a>
        <a className="crow" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <Icon name="work" />
          <div className="ctext">
            <small>LinkedIn</small>
            <span>Christian John Gundino</span>
          </div>
          <span className="cact">
            View profile <Icon name="arrow_outward" />
          </span>
        </a>
      </div>
    </div>
  )
}
