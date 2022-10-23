import type { ComponentType } from 'react'
import type { Language } from '../hooks/useLanguage'
import { useLanguage } from '../hooks/useLanguage'

export type Translations<T> = Record<Language, T>
export type PropsWithTranslation<T, P = unknown> = P & { translation: T }

export const withTranslation = <Props, OwnTranslation>(
  WrappedComponent: ComponentType<PropsWithTranslation<OwnTranslation, Props>>,
  translations: Translations<OwnTranslation>
) => {
  const ComponentWithTranslation = (props: Omit<Props, 'translation'>) => {
    const { language } = useLanguage()
    const translation = translations[language]
    const mergedProps = { ...props, translation } as PropsWithTranslation<OwnTranslation, Props>
    return <WrappedComponent {...mergedProps} />
  }
  return ComponentWithTranslation
}
