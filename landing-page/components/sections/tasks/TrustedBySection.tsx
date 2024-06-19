import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { VerticalDivider } from '@helpwave/common/components/VerticalDivider'
import { DividerInserter } from '@helpwave/common/components/layout/DividerInserter'
import Image from 'next/image'
import { Span } from '@helpwave/common/components/Span'
import { SectionBase } from '@/components/sections/SectionBase'
import type { Partner } from '@/components/PartnerList'

type TrustedBySectionTranslation = {
  title: string
}

const defaultTrustedBySectionTranslation: Record<Languages, TrustedBySectionTranslation> = {
  en: {
    title: 'Trusted by'
  },
  de: {
    title: 'Unterstüzt von'
  }
}

const images: Partner[] = [
  {
    name: 'UKM',
    url: 'https://cdn.helpwave.de/partners/ukm.png'
  },
]

const TrustedBySection = () => {
  const translation = useTranslation(defaultTrustedBySectionTranslation)

  return (
    <SectionBase className={tw('flex flex-col gap-y-8 select-none justify-between items-center w-full')} backgroundColor="gray">
      <Span type="title" className={tw('!text-2xl')}>{translation.title}</Span>
      <DividerInserter
        className={tw('flex flex-row gap-x-6 items-center justify-center w-full')}
        divider={index => (<VerticalDivider key={index} height={128}/>)}
      >
        {images.map(partner => (
          <Image
            key={partner.name}
            width={0}
            height={0}
            src={partner.url}
            alt={partner.name}
            className={tw('w-auto max-h-[64px]')}
          />
        ))}
      </DividerInserter>
    </SectionBase>
  )
}

export default TrustedBySection
