import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { tx } from '@twind/core'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StartSection from '@/components/sections/tasks/StartSection'
import FeatureSection from '@/components/sections/tasks/FeatureSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import ReachoutSection from '@/components/sections/tasks/ReachoutSection'
const Tasks: NextPage = () => {
  const sectionClassName = tw('max-w-[1000px] desktop:mx-auto mobile:px-6 tablet:px-12 desktop:px-24 relative z-[1] my-16')

  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tx(sectionClassName, 'mt-32')}>
        <StartSection />
      </div>
      <Divider />
      <div className={tw(sectionClassName)}>
        <FeatureSection />
      </div>
      <Divider />
      <div className={tw(sectionClassName)}>
        <ReachoutSection />
      </div>
      <Divider />
      <div className={tw(sectionClassName)}>
        <DemoSection />
      </div>
      <Footer />
    </div>
  )
}

export default Tasks
