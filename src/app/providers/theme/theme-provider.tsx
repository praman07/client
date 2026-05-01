import { createContext, useContext, useEffect, useState } from 'react'
import { ScriptOnce } from '@tanstack/react-router'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/**
 * Inline script injected before React hydrates to prevent FOUC.
 * Sets data-theme attribute (not class) to match our CSS @custom-variant dark selector:
 * &:where([data-theme*="dark"], [data-theme*="dark"] *)
 */
function getThemeScript(storageKey: string, defaultTheme: Theme): string {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)
  return `(function(){try{
    var t=localStorage.getItem(${key});
    if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}
    var d=matchMedia('(prefers-color-scheme: dark)').matches;
    var r=t==='system'?(d?'dark':'light'):t;
    document.documentElement.setAttribute('data-theme',r);
    document.documentElement.style.colorScheme=r;
  }catch(e){}})();`
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  // Use data-theme attribute — matches @custom-variant dark in variables.css
  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'dark',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'collabify-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    setThemeState(
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme,
    )
    setMounted(true)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  // Keep in sync with OS preference when theme = 'system'
  useEffect(() => {
    if (!mounted || theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    setThemeState(next)
  }

  return (
    <ThemeProviderContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
