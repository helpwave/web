import type { ComponentType } from 'react'
import type { Language } from '../hooks/useLanguage'
import { useLanguage } from '../hooks/useLanguage'

export type EventualString = string | ((...args: any[]) => string);
export type Translation<T = Record<string, EventualString>> = Record<keyof T, EventualString>;
export type Translations<T extends Translation> = Record<Language, T>;
export type PropsWithTranslation<T extends Translation, P = unknown> = P & { translation: T };

export const withTranslation = <Props, OwnTranslation extends Translation>(
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
