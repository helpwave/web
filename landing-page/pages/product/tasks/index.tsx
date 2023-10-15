import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import StartSection from '../../../components/sections/tasks/StartSection'
import FeatureSection from '../../../components/sections/tasks/FeatureSection'
import Divider from '../../../components/Divider'
import DemoSection from '../../../components/sections/tasks/DemoSection'

const Tasks: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <StartSection />
      </div>
      <Divider />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <FeatureSection />
      </div>
      <Divider />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <DemoSection />
      </div>
      <Footer />
    </div>
  )
}

export default Tasks
