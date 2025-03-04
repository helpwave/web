import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ThemeType } from '../twind/theme-variables'
import { ThemeVariables } from '../twind/theme-variables'

type ThemeContextType = {
  theme: ThemeType,
  themeColors: Record<string, string>,
  setTheme: Dispatch<SetStateAction<ThemeType>>,
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themeColors: {},
  setTheme: (_: SetStateAction<ThemeType>) => {
  },
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light')

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `:root { ${Object.entries(ThemeVariables.themes[theme])
      .map(([key, value]) => `--${key}: ${value};`)
      .join('\n')} }`
    document.head.appendChild(style)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, themeColors: ThemeVariables.themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
