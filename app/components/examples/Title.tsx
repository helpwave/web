import type { FunctionComponent } from 'react'
import type { PropsWithTranslation, Translations } from '../../hocs/withTranslation'
import { withTranslation } from '../../hocs/withTranslation'
import { Language } from '../../hooks/useLanguage'

type TitleTranslation = {
  welcome: string,
  goodToSeeYou: string,
  page: (page: number) => string
}

type TitleProps = {
  name: string
}

// Simple Title component to demonstrate some translations
const Title: FunctionComponent<PropsWithTranslation<TitleTranslation, TitleProps>> = (props) => {
  return (
    <p className="rounded bg-gray-800 text-gray-200 p-1 px-2">
      {props.translation.welcome}{'! '}
      {props.translation.goodToSeeYou}{', '}
      <span className="text-green-300">{props.name}</span>{'. '}
      {props.translation.page(123)}
    </p>
  )
}

const defaultTitleTranslations: Translations<TitleTranslation> = {
  [Language.EN]: {
    welcome: 'Welcome',
    goodToSeeYou: 'Good to see you',
    page: (page) => `Page ${page}`
  },
  [Language.DE]: {
    welcome: 'Willkommen',
    goodToSeeYou: 'Schön dich zu sehen',
    page: (page) => `Seite ${page}`
  }
}

export default withTranslation(Title, defaultTitleTranslations)
