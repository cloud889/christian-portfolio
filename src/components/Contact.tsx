import { useRef, useState } from 'react'
import { profile } from '../data/profile'

export default function Contact() {
  const text = useRef<HTMLSpanElement>(null)
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
      <h2>Have a site that needs to work harder?</h2>
      <div className="mail">
        <span ref={text}>{profile.email}</span>
        <button onClick={copy}>{label}</button>
      </div>
    </div>
  )
}
