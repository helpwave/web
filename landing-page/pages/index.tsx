import type { NextPage } from 'next'
import { useTranslation } from '@helpwave/hightide'
import type { PropsForTranslation, Languages } from '@helpwave/hightide'
import MarketStatsSection from '../components/sections/landing/MarketStatsSection'
import PartnerSection from '../components/sections/landing/Partners'
import StartSection from '../components/sections/landing/StartSection'
import { Page } from '@/components/Page'
import VisionSection from '@/components/sections/landing/VisionSection'
import { TasksDemoSection } from '@/components/sections/landing/TasksDemoSection'
import { StepsToDigitalizationSection } from '@/components/sections/landing/StepsToDigitalizationSection'

type HomeTranslation = {
  home: string,
}

const defaultHomeTranslation: Record<Languages, HomeTranslation> = {
  en: {
    home: 'home',
  },
  de: {
    home: 'home',
  }
}

const Home: NextPage = ({ overwriteTranslation }: PropsForTranslation<HomeTranslation>) => {
  const translation = useTranslation(defaultHomeTranslation, overwriteTranslation)
  return (
    <Page outerClassName="z-0" className="z-0" pageTitleAddition={translation.home}>
      <StartSection/>
      <PartnerSection/>
      <VisionSection/>
      <StepsToDigitalizationSection/>
      <TasksDemoSection/>
      <MarketStatsSection/>
      {/* TODO implement when ready <StoriesSliderSection/> */}
    </Page>
  )
}

export default Home
