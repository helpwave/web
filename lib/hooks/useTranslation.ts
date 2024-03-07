import type { Languages } from './useLanguage'
import { useLanguage } from './useLanguage'

type OverwriteTranslationType<Translation extends Record<string, unknown>> = {
  language?: Languages,
  translation?: Partial<Record<Languages, Partial<Translation>>>
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
  overwriteTranslation?: OverwriteTranslationType<Translation>
};

export const useTranslation = <Translation extends Record<string, unknown>>(
  translationOverwrite: OverwriteTranslationType<Translation> = {},
  defaults: Record<Languages, Translation>
) => {
  const { language: languageProp, translation: overwrite } = translationOverwrite
  const { language: inferredLanguage } = useLanguage()
  const usedLanguage = languageProp ?? inferredLanguage
  return Object.assign(
    defaults[usedLanguage],
    overwrite
  )
}
