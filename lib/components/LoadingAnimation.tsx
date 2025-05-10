import type { Languages } from '../hooks/useLanguage'
import type { PropsForTranslation } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'
import { Helpwave } from './icons/Helpwave'
import clsx from 'clsx'

type LoadingAnimationTranslation = {
  loading: string,
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
  classname?: string,
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
    <div className={clsx('col items-center justify-center w-full h-24', classname)}>
      <Helpwave animate="loading" />
      {loadingText ?? `${translation.loading}...`}
    </div>
  )
}
