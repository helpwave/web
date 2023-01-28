import type { Languages } from '../hooks/useLanguage'
import { useLanguage, DEFAULT_LANGUAGE } from '../hooks/useLanguage'

export type PropsWithLanguage<Translation, Props = Record<string, never>> = Props & {
  language?: Partial<Translation> | Languages
}

export const useTranslation = <Language extends Record<string, unknown>>(
  languageProp: PropsWithLanguage<Language>['language'],
  defaults: Record<Languages, Language>
) => {
  const { language: inferredLanguage } = useLanguage()
  if (languageProp === undefined) {
    return defaults[inferredLanguage]
  } else if (typeof languageProp !== 'object') {
    return defaults[languageProp as Languages]
  } else {
    return Object.assign(defaults[DEFAULT_LANGUAGE], languageProp as Partial<Language>)
  }
}
