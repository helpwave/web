import { tw } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Link from 'next/link'

type MobileInterceptorTranslation = {
  pleaseDownloadApp: string,
  playstore: string
}

const defaultMobileInterceptorTranslation = {
  en: {
    pleaseDownloadApp: 'Please download the app',
    playstore: 'Playstore'
  },
  de: {
    pleaseDownloadApp: 'Bitte laden sie die app herunter',
    playstore: 'Playstore'
  }
}

export const MobileInterceptor = ({ language }:PropsWithLanguage<MobileInterceptorTranslation>) => {
  const translation = useTranslation(language, defaultMobileInterceptorTranslation)
  const playstoreLink = ''
  return (
    <div className={tw('flex flex-col items-center justify-center')}>
      <span>{translation.pleaseDownloadApp}</span>
      <Link href={playstoreLink}>{translation.pleaseDownloadApp}</Link>
    </div>
  )
}
