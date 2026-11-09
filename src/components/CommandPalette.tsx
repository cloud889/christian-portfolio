import { useEffect, useMemo, useRef, useState } from 'react'
import { projects, type Project } from '../data/projects'

type Item = { label: string; hint: string; run: () => void }

type Props = { onClose: () => void; onOpenProject: (project: Project) => void; onReplay: () => void }

const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/** Ctrl/Cmd + K quick jump to a project or section. */
export default function CommandPalette({ onClose, onOpenProject, onReplay }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  const items = useMemo<Item[]>(
    () => [
      ...projects.map((p) => ({ label: p.name, hint: 'Project', run: () => onOpenProject(p) })),
      { label: 'Overview', hint: 'Section', run: () => goTo('overview') },
      { label: 'Projects', hint: 'Section', run: () => goTo('projects') },
      { label: 'Stack', hint: 'Section', run: () => goTo('skills') },
      { label: 'History', hint: 'Section', run: () => goTo('timeline') },
      { label: 'Contact', hint: 'Section', run: () => goTo('contact') },
      { label: 'Replay intro', hint: 'Action', run: onReplay },
    ],
    [onOpenProject, onReplay],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items
  }, [items, query])

  useEffect(() => {
    input.current?.focus()
  }, [])

  const run = (item: Item | undefined) => {
    if (!item) return
    onClose()
    item.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => (s + 1) % Math.max(filtered.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => (s - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[selected])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="pal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="pal-box" role="dialog" aria-label="Quick jump" onKeyDown={onKeyDown}>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(0)
          }}
          placeholder="Search projects and sections"
          aria-label="Search projects and sections"
          autoComplete="off"
        />
        <ul>
          {filtered.length === 0 && <li className="none">No match. Try another word.</li>}
          {filtered.map((item, i) => (
            <li key={item.hint + item.label} className={i === selected ? 'sel' : undefined} onMouseEnter={() => setSelected(i)} onClick={() => run(item)}>
              {item.label}
              <small>{item.hint}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
