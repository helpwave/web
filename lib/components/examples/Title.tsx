import { tw } from '../../twind'
import { useTranslation } from '../../hooks/useTranslation'
import type { PropsForTranslation } from '../../hooks/useTranslation'
import type { Languages } from '../../hooks/useLanguage'

type TitleTranslation = {
  welcome: string,
  goodToSeeYou: string,
  page: (page: number) => string
}

const defaultTitleTranslations: Record<Languages, TitleTranslation> = {
  en: {
    welcome: 'Welcome',
    goodToSeeYou: 'Good to see you',
    page: (page) => `Page ${page}`
  },
  de: {
    welcome: 'Willkommen',
    goodToSeeYou: 'Schön dich zu sehen',
    page: (page) => `Seite ${page}`
  }
}

type TitleProps = {
  name: string
}

/**
 * Simple Title component to demonstrate some translations
 */
const Title = ({ overwriteTranslation, name }:PropsForTranslation<TitleTranslation, TitleProps>) => {
  const translation = useTranslation(defaultTitleTranslations, overwriteTranslation)
  return (
    <p className={tw('rounded bg-gray-800 text-gray-200 p-1 px-2')}>
      {translation.welcome}{'! '}
      {translation.goodToSeeYou}{', '}
      <span className={tw('text-green-300')}>{name}</span>{'. '}
      {translation.page(123)}
    </p>
  )
}

export default Title
