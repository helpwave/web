import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { VerticalDivider } from '@helpwave/common/components/VerticalDivider'
import { DividerInserter } from '@helpwave/common/components/layout/DividerInserter'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'
import type { Partner } from '@/components/PartnerList'

type TrustedBySectionTranslation = {
  title: string,
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
    <SectionBase className={clsx('col gap-y-8 select-none justify-between items-center w-full')} backgroundColor="gray">
      <span className={clsx('textstyle-title-lg')}>{translation.title}</span>
      <DividerInserter
        className={clsx('row gap-x-6 items-center justify-center w-full')}
        divider={index => (<VerticalDivider key={index} height={128}/>)}
      >
        {images.map(partner => (
          <Image
            key={partner.name}
            width={0}
            height={0}
            src={partner.url}
            alt={partner.name}
            className={clsx('w-auto max-h-[64px]')}
          />
        ))}
      </DividerInserter>
    </SectionBase>
  )
}

export default TrustedBySection
