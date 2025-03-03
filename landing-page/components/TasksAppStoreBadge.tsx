import { useLanguage } from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import Link from 'next/link'
import { tw } from '@helpwave/color-themes/twind'

/**
 * WHEN USING MAKE THE NECESSARY ATTRIBUTION TO APPLE
 *
 * https://developer.apple.com/app-store/marketing/guidelines/
 *
 * Margin of 10% of element to all sides (8px)
 * Min height of 40px must be kepts
 */
export const TasksAppStoreBadge = () => {
  const { language } = useLanguage()
  const linkURL = {
    de: 'https://apps.apple.com/de/app/helpwave-tasks/id6472594365?itsct=apps_box_badge&amp;itscg=30200',
    en: 'https://apps.apple.com/en/app/helpwave-tasks/id6472594365?itsct=apps_box_badge&amp;itscg=30200'
  }[language]

  const alt = {
    de: 'Jetzt bei Google Play',
    en: 'Download on the App Store'
  }[language]

  const imageURL = {
    de: 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/de-de?size=250x83&amp;releaseDate=1702857600',
    en: 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1702857600'
  }[language]

  return (
    <Link href={linkURL} target="_blank">
      <Image
        alt={alt} src={imageURL} height={0} width={156}
        className={tw('w-full min-h-[54px] max-h-[54px] min-w-[156px] max-w-[156px]')}
      />
    </Link>
  )
}
