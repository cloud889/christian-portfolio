import { useEffect, useRef } from 'react'
import { useMotion } from '../lib/motion-mode'

const STEP = 36

/** Fixed dot-grid background. Reacts to the pointer unless motion is off; waves only in "led" mode. */
export default function DotGrid() {
  const { mode } = useMotion()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let pending = false
    const pointer = { x: -999, y: -999, on: false }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let gx = STEP / 2; gx < w; gx += STEP) {
        for (let gy = STEP / 2; gy < h; gy += STEP) {
          const dx = gx - pointer.x
          const dy = gy - pointer.y
          const d = Math.hypot(dx, dy)
          const f = pointer.on ? Math.max(0, 1 - d / 230) : 0
          let px = gx
          let py = gy
          if (f > 0 && d > 0) {
            px += (dx / d) * f * 14
            py += (dy / d) * f * 14
          }
          const wave = mode === 'led' ? Math.sin(t / 1300 + gx * 0.018 + gy * 0.013) * 0.5 + 0.5 : 0
          ctx.fillStyle = `rgba(143,227,255,${(0.1 + wave * 0.13 + f * 0.7).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(px, py, 1 + wave * 0.6 + f * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(0)
    }

    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      if (mode === 'off') return
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.on = true
      if (mode === 'balanced' && !pending) {
        pending = true
        requestAnimationFrame(() => {
          pending = false
          draw(0)
        })
      }
    }

    resize()
    if (mode === 'led') raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [mode])

  return <canvas ref={ref} className="bg" aria-hidden="true" />
}
