import { useContext } from 'react'
import type { Dispatch, SetStateAction, PropsWithChildren } from 'react'
import { createContext, useState, useEffect } from 'react'
import type { Translation } from './useTranslation'

export type ThemeType = 'light' | 'dark'

export type ThemeTypeTranslation = Record<ThemeType, string>
export const defaultThemeTypeTranslation: Translation<ThemeTypeTranslation> = {
  en: {
    dark: 'Dark',
    light: 'Light'
  },
  de: {
    dark: 'Dunkel',
    light: 'Hell'
  }
}

type ThemeContextType = {
  theme: ThemeType,
  setTheme: Dispatch<SetStateAction<ThemeType>>,
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: (_: SetStateAction<ThemeType>) => {
  },
})

type ThemeProviderProps = {
  initialTheme?: ThemeType,
}

export const ThemeProvider = ({ children, initialTheme = 'light' }: PropsWithChildren<ThemeProviderProps>) => {
  const [theme, setTheme] = useState<ThemeType>(initialTheme)

  useEffect(() => {
    if (theme !== initialTheme) {
      console.warn('ThemeProvider initial state changed: Prefer using useTheme\'s setTheme instead')
      setTheme(initialTheme)
    }
  }, [initialTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}


export const useTheme = () => useContext(ThemeContext)
