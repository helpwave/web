import type { NextPage } from 'next'
import StartSection from '@/components/sections/tasks/StartSection'
import FeatureSection from '@/components/sections/tasks/FeatureSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import ReachoutSection from '@/components/sections/tasks/ReachoutSection'
import { Page } from '@/components/Page'
import TrustedBySection from '@/components/sections/tasks/TrustedBySection'

const Tasks: NextPage = () => {
  return (
    <Page>
      <StartSection/>
      <TrustedBySection/>
      <FeatureSection/>
      <Divider/>
      <ReachoutSection/>
      <Divider/>
      <DemoSection/>
    </Page>
  )
}

export default Tasks
