import type { PropsWithChildren } from 'react'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { Translation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { LoadingAnimation } from '@helpwave/hightide'

const defaultTranslation: Translation<{ loggingIn: string }> = {
  en: {
    loggingIn: 'Logging In...',
  },
  de: {
    loggingIn: 'Einloggen...',
  },
}

export const InitializationChecker = ({ children }: PropsWithChildren) => {
  const translation = useTranslation(defaultTranslation)
  const { user } = useAuth()

  if(!user) {
    return (
      <div className="col justify-center items-center w-screen h-screen">
        <LoadingAnimation loadingText={translation.loggingIn}/>
      </div>
    )
  }
  return children
}
