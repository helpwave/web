import type { Languages } from './useLanguage'
import { useLanguage } from './useLanguage'

/**
 * Adds the `language` prop to the component props.
 *
 * @param Props the type of the component props, defaults to `Record<string, never>`,
 *              if you don't expect any other props other than `language` and get an
 *              error when using your component (because it uses `forwardRef` etc.)
 *              you can try out `Record<string, unknown>`, this might resolve your
 *              problem as `SomeType & never` is still `never` but `SomeType & unknown`
 *              is `SomeType` which means that adding back props (like `ref` etc.)
 *              works properly
 */
export type PropsWithLanguage<
  Props = Record<string, never>
> = Props & {
  language?: Languages
};

export const useTranslation = <Translation extends Record<string, unknown>>(
  languageProp: Languages | undefined,
  defaults: Record<Languages, Translation>
) => {
  const { language: inferredLanguage } = useLanguage()
  if (languageProp === undefined) {
    return defaults[inferredLanguage]
  } else {
    return defaults[languageProp as Languages]
  }
}
