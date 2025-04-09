import type { NextPage } from 'next'
import Link from 'next/link'
import clsx from 'clsx'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { getConfig } from '@/utils/config'

type MobileInterceptorTranslation = {
  pleaseDownloadApp: string,
  playStore: string,
  appStore: string,
}

const defaultMobileInterceptorTranslation = {
  en: {
    pleaseDownloadApp: 'Please download the app',
    playStore: 'Google Play Store',
    appStore: 'Apple App Store'
  },
  de: {
    pleaseDownloadApp: 'Bitte laden Sie die App herunter',
    playStore: 'Google Play Store',
    appStore: 'Apple App Store'
  }
}

/**
 * The component shown when the user is looking at the app form a mobile
 *
 * Currently, the user is prevented from using the application from mobile and the link to
 * the helpwave app will be shown
 */
const MobileInterceptor: NextPage = ({ overwriteTranslation }: PropsForTranslation<MobileInterceptorTranslation>) => {
  const translation = useTranslation(defaultMobileInterceptorTranslation, overwriteTranslation)
  const config = getConfig()
  const playStoreLink = config.appstoreLinks.playStore
  const appstoreLink = config.appstoreLinks.appStore
  return (
    <div className={clsx('w-screen h-[80vh] flex flex-col items-center justify-center')}>
      <Helpwave className={clsx('w-1/3 mx-auto h-auto mb-2 text-black')}/>
      <span className={clsx('textstyle-title-normal mb-8')}>{translation.pleaseDownloadApp}</span>
      <Link href={playStoreLink}>{translation.playStore}</Link>
      <Link href={appstoreLink}>{translation.appStore}</Link>
    </div>
  )
}

export default MobileInterceptor
