import type { ComponentType } from 'react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

/**
 * This is a higher order component, which might have some problems with ref passing.
 * Therefore, it is recommended to use the `useTranslation` hook instead.
 * `useTranslation` is also used in the `withTranslation` hoc internally.
 */
export const withTranslation = <Props, OwnTranslation extends Record<string, unknown>>(
  WrappedComponent: ComponentType<Props & { language: OwnTranslation }>,
  translations: Record<Languages, OwnTranslation>
) => {
  const ComponentWithTranslation = (props: Omit<Props, 'language'>) => {
    const translation = useTranslation<OwnTranslation>(useLanguage().language, translations)
    const mergedProps = { ...props, language: translation } as Props & { language: OwnTranslation }
    return <WrappedComponent {...mergedProps} />
  }
  return ComponentWithTranslation
}
