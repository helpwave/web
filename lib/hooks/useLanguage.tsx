import { createContext, useContext, useEffect, useState } from 'react'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

const languages = ['en', 'de'] as const
export type Languages = typeof languages[number]

export const DEFAULT_LANGUAGE = 'en'

export type LanguageContextValue = {
  language: Languages,
  setLanguage: Dispatch<SetStateAction<Languages>>
}

export const LanguageContext = createContext<LanguageContextValue>({ language: DEFAULT_LANGUAGE, setLanguage: (v) => v })

export const useLanguage = () => useContext(LanguageContext)

export const ProvideLanguage = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Languages>(DEFAULT_LANGUAGE)

  useEffect(() => {
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
