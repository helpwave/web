import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import MarketStatsSection from '../components/sections/landing/MarketStatsSection'
import PartnerSection from '../components/sections/landing/Partners'
import StartSection from '../components/sections/landing/StartSection'
import { Page } from '@/components/Page'
import VisionSection from '@/components/sections/landing/VisionSection'
import { TasksDemoSection } from '@/components/sections/landing/TasksDemoSection'
import { StepsToDigitalizationSection } from '@/components/sections/landing/StepsToDigitalizationSection'

const Home: NextPage = () => {
  return (
    <Page outerClassName={tw('z-0')} className={tw('z-0')}>
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
