import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'

type StoryHeaderTranslation = {
  foundingStory: string,
  foundingStoryDescription: string
}

const defaultStoryHeaderTranslation: Record<Languages, StoryHeaderTranslation> = {
  en: {
    foundingStory: 'Founding Story',
    foundingStoryDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor justo, semper at augue eget, auctor feugiat metus. Proin lacinia odio ante, nec maximus ipsum eleifend ut. Ut ornare nisl urna, nec sollicitudin ante dignissim.',
  },
  de: {
    foundingStory: 'Gründungsgeschichte',
    foundingStoryDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor justo, semper at augue eget, auctor feugiat metus. Proin lacinia odio ante, nec maximus ipsum eleifend ut. Ut ornare nisl urna, nec sollicitudin ante dignissim.',
  }
}

const StoryHeader = ({ overwriteTranslation }: PropsForTranslation<StoryHeaderTranslation>) => {
  const translation = useTranslation(defaultStoryHeaderTranslation, overwriteTranslation)

  return (
    <SectionBase className={tw('text-white')} backgroundColor="black" isFirstSection={true}>
      <div className={tw('flex flex-col items-center desktop:!flex-row gap-x-16 gap-y-8 justify-between')}>
        <div className={tw('flex flex-col gap-y-2')}>
          <Span type="title" className={tw('!text-3xl')}>{translation.foundingStory}</Span>
          <Span>{translation.foundingStoryDescription}</Span>
        </div>
        <Image src="https://cdn.helpwave.de/story/audience_award_mshack.png" alt="" width={0} height={0} className={tw('w-full desktop:max-w-[60%]')}/>
      </div>
    </SectionBase>
  )
}

export default StoryHeader
