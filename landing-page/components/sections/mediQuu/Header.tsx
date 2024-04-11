import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import Image from 'next/image'
import { HelpwaveBadge } from '@helpwave/common/components/HelpwaveBadge'

type MediQuuHeaderTranslation = {
  title: string,
  subTitle: string
}

const defaultMediQuuPageTranslation: Record<Languages, MediQuuHeaderTranslation> = {
  en: {
    title: 'mediQuu becomes helpwave',
    subTitle: 'helpwave is taking over mediQuu in order to further develop its digitally networked healthcare solutions ' +
      'without any changes for existing mediQuu customers.'
  },
  de: {
    title: 'Aus mediQuu wird helpwave',
    subTitle: 'helpwave übernimmt mediQuu, um deren digital vernetzte Gesundheitslösungen weiterzuentwickeln,' +
      ' ohne dass sich für bestehende mediQuu-Kunden Veränderungen ergeben.'
  }
}

export const MediQuuHeaderSection = () => {
  const translation = useTranslation(defaultMediQuuPageTranslation)
  return (
    <div className={tw('flex desktop:flex-row mobile:flex-col-reverse gap-8 mobile:items-center justify-center max-w-[1000px]')}>
      <div className={tw('flex flex-col gap-y-2 max-w-')}>
        <Span type="title" className={tw('!text-5xl')}>{translation.title}</Span>
        <Span className={tw('text-lg')}>{translation.subTitle}</Span>
      </div>
      <div className={tw('flex flex-col gap-y-4 min-w-[350px] max-w-[350px]')}>
        <div className={tw('bg-white rounded-md px-6 py-4 !gap-x-2 !w-fit shadow-md')}>
          <Image src="https://cdn.helpwave.de/mediquu/logo_2021.png" alt="" width={140} height={64}/>
        </div>
        <div className={tw('flex flex-row grow justify-end')}>
          <HelpwaveBadge
            size="large"
            className="bg-hw-secondary-800 !gap-x-2 !w-fit shadow-md"
          />
        </div>
      </div>
    </div>
  )
}
