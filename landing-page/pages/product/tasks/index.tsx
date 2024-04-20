import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StartSection from '@/components/sections/tasks/StartSection'
import FeatureSection from '@/components/sections/tasks/FeatureSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import ReachoutSection from '@/components/sections/tasks/ReachoutSection'

const Tasks: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <StartSection/>
      <Divider/>
      <FeatureSection/>
      <Divider/>
      <ReachoutSection/>
      <Divider/>
      <DemoSection/>
      <Footer/>
    </div>
  )
}

export default Tasks
