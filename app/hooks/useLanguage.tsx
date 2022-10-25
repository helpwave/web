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
    // TODO: this is one of the few places where unit tests would be useful
    const languagesToTestAgainst: [string, Language][] = [
      ...Object.values(Language).map(language => [language, language]) as [string, Language][],
      ...Object.values(Language).map(language => [language.split('-')[0], language]) as [string, Language][]
    ].sort((a, b) => b[0].localeCompare(a[0]))

    const matchingBrowserLanguages = window.navigator.languages
      .map(language => languagesToTestAgainst.find(([test]) => language === test))
      .filter(entry => entry !== undefined) as [string, Language][]

    if (matchingBrowserLanguages.length === 0) return

    const firstMatch = matchingBrowserLanguages[0][1]
    console.log(`setting language to: ${firstMatch}`)
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
