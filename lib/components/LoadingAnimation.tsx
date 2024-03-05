import type { Languages } from '../hooks/useLanguage'
import type { PropsWithLanguage } from '../hooks/useTranslation'
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
  language,
  loadingText,
  classname
}: PropsWithLanguage<LoadingAnimationProps>) => {
  const translation = useTranslation(language, defaultLoadingAnimationTranslation)
  return (
    <div className={tx('flex flex-col items-center justify-center gap-y-2 w-full h-24', classname)}>
      <Helpwave animate="loading" />
      {loadingText ?? `${translation.loading}...`}
    </div>
  )
}
