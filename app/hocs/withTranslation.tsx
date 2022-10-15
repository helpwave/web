import type { ComponentType } from 'react'
import type { Language } from '../hooks/useLanguage'
import { useLanguage } from '../hooks/useLanguage'

export type EventualString = string | ((...args: any[]) => string);
export type Translation<T = Record<string, EventualString>> = Record<keyof T, EventualString>;
export type Translations<T extends Translation> = Record<Language, T>;
export type PropsWithTranslation<P, T extends Translation> = P & { translation: T };

export const withTranslation = <Props, OwnTranslation extends Translation>(
  WrappedComponent: ComponentType<PropsWithTranslation<Props, OwnTranslation>>,
  translations: Translations<OwnTranslation>
) => {
  const ComponentWithTranslation = (props: Omit<Props, 'translation'>) => {
    const { language } = useLanguage()
    const translation = translations[language]
    const mergedProps = { ...props, translation } as PropsWithTranslation<Props, OwnTranslation>
    return <WrappedComponent {...mergedProps} />
  }
  return ComponentWithTranslation
}
