import type { ComponentType } from 'react'
import type { Language } from '../hooks/useLanguage'
import { useLanguage } from '../hooks/useLanguage'

export type EventualString = string | ((...args: any[]) => string);
export type Translation<T = Record<string, EventualString>> = Record<keyof T, EventualString>;
export type Translations<T = Translation> = Record<Language, T>;
export type PropsWithTranslation<T = Translation, P = unknown> = P & { translation: T };

export const withTranslation = <T extends PropsWithTranslation>(WrappedComponent: ComponentType<T>, translations: Translations) => {
  const ComponentWithTranslation = (props: Omit<T, keyof PropsWithTranslation>) => {
    const { language } = useLanguage()
    const translation = translations[language]
    return <WrappedComponent {...props as T} translation={translation} />
  }
  return ComponentWithTranslation
}
