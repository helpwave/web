import type { Languages } from '../hooks/useLanguage'
import { useLanguage, DEFAULT_LANGUAGE } from '../hooks/useLanguage'

/**
 * Adds the `language` prop to the component props.
 *
 * @param Translation the type of the translation object
 *
 * @param Props the type of the component props, defaults to `Record<string, never>`,
 *              if you don't expect any other props other than `language` and get an
 *              error when using your component (because it uses `forwardRef` etc.)
 *              you can try out `Record<string, unknown>`, this might resolve your
 *              problem as `SomeType & never` is still `never` but `SomeType & unknown`
 *              is `SomeType` which means that adding back props (like `ref` etc.)
 *              works properly
 */
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
