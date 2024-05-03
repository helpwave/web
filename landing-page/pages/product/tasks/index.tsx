import type { NextPage } from 'next'
import StartSection from '@/components/sections/tasks/StartSection'
import FeatureSection from '@/components/sections/tasks/FeatureSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import ReachoutSection from '@/components/sections/tasks/ReachoutSection'
import { Page } from '@/components/Page'
import { ConnectOrganizationFeatureSection } from '@/components/sections/tasks/ConnectOrganizationFeature'
import { MobileFeatureSection } from '@/components/sections/tasks/MobileFeatureSection'

const Tasks: NextPage = () => {
  return (
    <Page>
      <StartSection/>
      <Divider/>
      <FeatureSection/>
      <ConnectOrganizationFeatureSection/>
      <MobileFeatureSection/>
      <Divider/>
      <ReachoutSection/>
      <Divider/>
      <DemoSection/>
    </Page>
  )
}

export default Tasks
