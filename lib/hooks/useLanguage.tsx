import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage'

export const languages = ['en', 'de'] as const
export type Languages = typeof languages[number]

export const DEFAULT_LANGUAGE: Languages = 'en'

export type LanguageContextValue = {
  language: Languages,
  setLanguage: Dispatch<SetStateAction<Languages>>
}

export const LanguageContext = createContext<LanguageContextValue>({ language: DEFAULT_LANGUAGE, setLanguage: (v) => v })

export const useLanguage = () => useContext(LanguageContext)

export const useLocals = () => {
  const { language } = useLanguage()
  const mapping: Record<Languages, string> = {
    en: 'en-US',
    de: 'de-DE'
  }
  return mapping[language ?? DEFAULT_LANGUAGE]
}

export const ProvideLanguage = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Languages>(DEFAULT_LANGUAGE)
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Languages>('language', DEFAULT_LANGUAGE)

  useEffect(() => {
    setStoredLanguage(language)
  }, [language, setStoredLanguage])

  useEffect(() => {
    if (storedLanguage !== null) {
      setLanguage(storedLanguage)
      return
    }

    const languagesToTestAgainst = Object.values(languages)

    const matchingBrowserLanguages = window.navigator.languages
      .map(language => languagesToTestAgainst.find((test) => language === test || language.split('-')[0] === test))
      .filter(entry => entry !== undefined)

    if (matchingBrowserLanguages.length === 0) return

    const firstMatch = matchingBrowserLanguages[0] as Languages
    setLanguage(firstMatch)
  }, [])

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
