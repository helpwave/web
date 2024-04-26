import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { SectionBase } from '@/components/sections/SectionBase'
import type { Partner } from '@/components/PartnerList'
import { PartnerList } from '@/components/PartnerList'

type PartnerSectionTranslation = {
  title: string
}

const defaultPartnerSectionTranslation: Record<Languages, PartnerSectionTranslation> = {
  en: {
    title: 'Our partners'
  },
  de: {
    title: 'Unsere Partner'
  }
}

const images: Partner[] = [
  {
    name: 'REACH',
    url: 'https://cdn.helpwave.de/partners/reach.svg'
  },
  {
    name: 'Digital Hub münsterLAND',
    url: 'https://cdn.helpwave.de/partners/digitalhub_muensterland.png'
  },
  {
    name: 'Münsterhack',
    url: 'https://cdn.helpwave.de/partners/mshack_2023.png',
  }
]

const PartnerSection = () => {
  const translation = useTranslation(defaultPartnerSectionTranslation)

  return (
    <SectionBase className={tw('flex gap-16 select-none justify-between items-center w-full')} backgroundColor="gray">
      <PartnerList title={translation.title} partners={images}/>
    </SectionBase>
  )
}

export default PartnerSection
