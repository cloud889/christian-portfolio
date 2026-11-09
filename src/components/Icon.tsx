/** Material Symbols glyph. Names must stay in the icon_names list in index.html. */
export default function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`mi${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}
