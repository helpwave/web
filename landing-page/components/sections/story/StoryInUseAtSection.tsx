import { tw } from '@helpwave/style-themes/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'
import type { Partner } from '@/components/PartnerList'

type StoryInUseAtSectionTranslation = {
  title: string,
}

const defaultStoryInUseAtSectionTranslation: Record<Languages, StoryInUseAtSectionTranslation> = {
  en: {
    title: 'In use at'
  },
  de: {
    title: 'Benutzt von'
  }
}

const images: Partner[] = [
  {
    name: 'UKM',
    url: 'https://cdn.helpwave.de/partners/ukm.png'
  },
]

const StoryInUseAtSection = () => {
  const translation = useTranslation(defaultStoryInUseAtSectionTranslation)

  return (
    <SectionBase className={tw('flex flex-col gap-16 select-none justify-center items-center w-full')}>
      <span className={tw('textstyle-title-xl')}>{translation.title}</span>
      <div className={tw('flex flex-row justify-center')}>
        {images.map(partner => (
          <Image
            key={partner.name}
            width={0}
            height={0}
            src={partner.url}
            alt={partner.name}
            className={tw('w-auto max-h-[120px]')}
          />
        ))}
      </div>
    </SectionBase>
  )
}

export default StoryInUseAtSection
