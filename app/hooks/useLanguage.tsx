import type { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export enum Language {
  EN = 'en-US',
  DE = 'de-DE'
}

export const DEFAULT_LANGUAGE = Language.DE

export type LanguageContextValue = {
  language: Language,
  setLanguage: Dispatch<SetStateAction<Language>>
}

export const LanguageContext = createContext<LanguageContextValue>({ language: DEFAULT_LANGUAGE, setLanguage: (v) => v })

export const useLanguage = () => useContext(LanguageContext)

export const ProvideLanguage: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    const matchBrowserLanguage = Object.entries(Language).find(([_, language]) => language === window.navigator.language)
    if (!matchBrowserLanguage) return
    const [_, language] = matchBrowserLanguage
    setLanguage(language)
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
