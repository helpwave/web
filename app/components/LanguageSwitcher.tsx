import type { FunctionComponent } from 'react'
import type { PropsWithTranslation, Translations } from '../hocs/withTranslation'
import { withTranslation } from '../hocs/withTranslation'
import { Language, useLanguage } from '../hooks/useLanguage'

type LanguageSwitcherTranslation = {
  toggleLanguage: string
}

// TODO: Basic and naive implementation of a LanguageSwitcher
const LanguageSwitcher: FunctionComponent<PropsWithTranslation<LanguageSwitcherTranslation>> = ({ translation }) => {
  const { language, setLanguage } = useLanguage()

  const onClick = () => {
    if (language === Language.DE) setLanguage(Language.EN)
    if (language === Language.EN) setLanguage(Language.DE)
  }

  return (
    <button className="border-2 m-2 p-1 border-gray-800 text-gray-800 w-44" onClick={onClick}>{translation.toggleLanguage}</button>
  )
}

const defaultLanguageSwitcherTranslations: Translations<LanguageSwitcherTranslation> = {
  [Language.EN]: {
    toggleLanguage: 'Toggle language',
  },
  [Language.DE]: {
    toggleLanguage: 'Sprache wechseln',
  }
}

export default withTranslation(LanguageSwitcher, defaultLanguageSwitcherTranslations)
