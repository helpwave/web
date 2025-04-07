import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { createContext, useState, useEffect } from 'react'
import type { ThemeType } from '../types'

type ThemeContextType = {
  theme: ThemeType,
  setTheme: Dispatch<SetStateAction<ThemeType>>,
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: (_: SetStateAction<ThemeType>) => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

