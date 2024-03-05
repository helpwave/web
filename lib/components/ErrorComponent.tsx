import { AlertOctagon } from 'lucide-react'
import { tw, tx } from '../twind'
import type { Languages } from '../hooks/useLanguage'
import type { PropsWithLanguage } from '../hooks/useTranslation'
import { useTranslation } from '../hooks/useTranslation'

type ErrorComponentTranslation = {
  errorOccurred: string
}

const defaultErrorComponentTranslation: Record<Languages, ErrorComponentTranslation> = {
  en: {
    errorOccurred: 'An error occurred'
  },
  de: {
    errorOccurred: 'Ein Fehler ist aufgetreten'
  }
}

export type ErrorComponentProps = {
  errorText?: string,
  classname?: string
}

/**
 * The Component to show when an error occurred
 */
export const ErrorComponent = ({
  language,
  errorText,
  classname
}: PropsWithLanguage<ErrorComponentProps>) => {
  const translation = useTranslation(language, defaultErrorComponentTranslation)
  return (
    <div className={tx('flex flex-col items-center justify-center gap-y-4 w-full h-24', classname)}>
      <AlertOctagon size={64} className={tw('text-hw-warn-400')}/>
      {errorText ?? `${translation.errorOccurred} :(`}
    </div>
  )
}
