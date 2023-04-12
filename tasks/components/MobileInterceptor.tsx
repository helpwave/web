import { tw } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Link from 'next/link'
import HelpwaveLogo from '../icons/HelpwaveRect'

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
    pleaseDownloadApp: 'Bitte laden sie die App herunter',
    playstore: 'Playstore'
  }
}

export const MobileInterceptor = ({ language }:PropsWithLanguage<MobileInterceptorTranslation>) => {
  const translation = useTranslation(language, defaultMobileInterceptorTranslation)
  const playstoreLink = 'https://play.google.com/store/apps'
  return (
    <div className={tw('w-screen h-[80vh] flex flex-col items-center justify-center')}>
      <HelpwaveLogo className={tw('w-1/3 mx-auto h-auto mb-2 text-black')} />
      <span className={tw('text-lg font-semibold mb-8')}>{translation.pleaseDownloadApp}</span>
      <Link href={playstoreLink}>{translation.playstore}</Link>
    </div>
  )
}
