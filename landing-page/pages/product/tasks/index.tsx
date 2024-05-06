import type { NextPage } from 'next'
import StartSection from '@/components/sections/tasks/StartSection'
import FeatureSection from '@/components/sections/tasks/FeatureSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import ReachoutSection from '@/components/sections/tasks/ReachoutSection'
import { Page } from '@/components/Page'
import { ConnectOrganizationFeatureSection } from '@/components/sections/tasks/ConnectOrganizationFeature'
import { MobileFeatureSection } from '@/components/sections/tasks/MobileFeatureSection'
import { PatientSection } from '@/components/sections/tasks/PatientSection'
import { TasksKanbanSection } from '@/components/sections/tasks/TasksKanbanSection'
import { TasksTemplatesSection } from '@/components/sections/tasks/TasksTemplatesSection'
import { PropertiesSection } from '@/components/sections/tasks/PropertiesSection'

const Tasks: NextPage = () => {
  return (
    <Page>
      <StartSection/>
      <Divider/>
      <FeatureSection/>
      <ConnectOrganizationFeatureSection/>
      <MobileFeatureSection/>
      <PatientSection/>
      <TasksKanbanSection/>
      <TasksTemplatesSection/>
      <PropertiesSection/>
      <ReachoutSection/>
      <Divider/>
      <DemoSection/>
    </Page>
  )
}

export default Tasks
