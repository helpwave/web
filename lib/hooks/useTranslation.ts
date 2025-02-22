import type { Languages } from './useLanguage'
import { useLanguage } from './useLanguage'

export type Translation<T> = Record<Languages, T>

type OverwriteTranslationType<Translation extends Record<string, unknown>> = {
  language?: Languages,
  translation?: Partial<Record<Languages, Partial<Translation>>>,
}

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
export type PropsForTranslation<
  Translation extends Record<string, unknown>,
  Props = Record<string, never>
> = Props & {
  overwriteTranslation?: OverwriteTranslationType<Translation>,
};

export const useTranslation = <Translation extends Record<string, unknown>>(
  defaults: Record<Languages, Translation>,
  translationOverwrite: OverwriteTranslationType<Translation> = {}
) : Translation => {
  const { language: languageProp, translation: overwrite } = translationOverwrite
  const { language: inferredLanguage } = useLanguage()
  const usedLanguage = languageProp ?? inferredLanguage
  let defaultValues: Translation = defaults[usedLanguage]
  if (overwrite && overwrite[usedLanguage]) {
    defaultValues = { ...defaultValues, ...overwrite[usedLanguage] }
  }
  return defaultValues
}
