import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import Link from 'next/link'
import { tx } from '@twind/core'

/**
 * WHEN USING MAKE THE NECESSARY ATTRIBUTION TO GOOGLE
 *
 * https://play.google.com/intl/en_us/badges/
 *
 */
export const TasksPlaystoreBadge = () => {
  const { language } = useLanguage()
  const linkURL = {
    de: 'https://play.google.com/store/apps/details?id=de.helpwave.tasks&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1',
    en: 'https://play.google.com/store/apps/details?id=de.helpwave.tasks&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
  }[language]

  const alt = {
    de: 'Jetzt bei Google Play',
    en: 'Get it on Google Play'
  }[language]

  const imageURL = {
    de: '/images/google_play_badge_german.png',
    en: '/images/google_play_badge_english.png'
  }[language]
  return (
    <Link href={linkURL}>
      <Image alt={alt} src={imageURL} height={0} width={0} className={tx('w-full min-h-[54px] max-h-[54px] min-w-[182px] max-w-[182px]')}/>
    </Link>
  )
}
