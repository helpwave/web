import type { FunctionComponent } from 'react'
import { tw } from '@helpwave/common/twind/index'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

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

// Simple Title component to demonstrate some translations
const Title: FunctionComponent<PropsWithLanguage<TitleTranslation, TitleProps>> = (props) => {
  const translation = useTranslation(props.language, defaultTitleTranslations)
  return (
    <p className={tw('rounded bg-gray-800 text-gray-200 p-1 px-2')}>
      {translation.welcome}{'! '}
      {translation.goodToSeeYou}{', '}
      <span className={tw('text-green-300')}>{props.name}</span>{'. '}
      {translation.page(123)}
    </p>
  )
}

export default Title
