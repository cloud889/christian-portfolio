import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/** led = full motion, balanced = transitions only, off = static (also the reduced-motion default) */
export type Mode = 'led' | 'balanced' | 'off'

type MotionContextValue = {
  mode: Mode
  setMode: (mode: Mode) => void
  introKey: number
  replay: () => void
}

const MotionContext = createContext<MotionContextValue | null>(null)

const isMode = (v: string | null): v is Mode => v === 'led' || v === 'balanced' || v === 'off'

function initialMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  try {
    const stored = localStorage.getItem('motion-mode')
    if (isMode(stored)) return stored
  } catch {
    /* storage unavailable */
  }
  return 'led'
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(initialMode)
  const [introKey, setIntroKey] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.motion = mode
  }, [mode])

  const setMode = useCallback((next: Mode) => {
    setModeState(next)
    try {
      localStorage.setItem('motion-mode', next)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const replay = useCallback(() => {
    window.scrollTo({ top: 0 })
    setIntroKey((k) => k + 1)
  }, [])

  const value = useMemo(() => ({ mode, setMode, introKey, replay }), [mode, setMode, introKey, replay])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotion must be used inside MotionProvider')
  return ctx
}
