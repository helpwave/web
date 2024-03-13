import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { Helpwave } from '../icons/Helpwave'
import { tx } from '../twind'

type LoadingAnimationTranslation = {
  loading: string
}

const defaultLoadingAnimationTranslation: Record<Languages, LoadingAnimationTranslation> = {
  en: {
    loading: 'Loading data'
  },
  de: {
    loading: 'Lade Daten'
  }
}

export type LoadingAnimationProps = {
  loadingText?: string,
  classname?: string
}

/**
 * A Component to show when loading data
 */
export const LoadingAnimation = ({
  overwriteTranslation,
  loadingText,
  classname
}: PropsForTranslation<LoadingAnimationTranslation, LoadingAnimationProps>) => {
  const translation = useTranslation(defaultLoadingAnimationTranslation, overwriteTranslation)
  return (
    <div className={tx('flex flex-col items-center justify-center gap-y-2 w-full h-24', classname)}>
      <Helpwave animate="loading" />
      {loadingText ?? `${translation.loading}...`}
    </div>
  )
}
