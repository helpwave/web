import type { NextPage } from 'next'
import StartSection from '@/components/sections/tasks/StartSection'
import Divider from '@/components/Divider'
import DemoSection from '@/components/sections/tasks/DemoSection'
import { Page } from '@/components/Page'
import { ConnectOrganizationFeatureSection } from '@/components/sections/tasks/ConnectOrganizationFeature'
import { MobileFeatureSection } from '@/components/sections/tasks/MobileFeatureSection'
import { PatientSection } from '@/components/sections/tasks/PatientSection'
import { TasksKanbanSection } from '@/components/sections/tasks/TasksKanbanSection'
import { TasksTemplatesSection } from '@/components/sections/tasks/TasksTemplatesSection'
import { PropertiesSection } from '@/components/sections/tasks/PropertiesSection'
import TrustedBySection from '@/components/sections/tasks/TrustedBySection'

const Tasks: NextPage = () => {
  return (
    <Page>
      <StartSection/>
      <TrustedBySection/>
      <ConnectOrganizationFeatureSection/>
      <MobileFeatureSection/>
      <PatientSection/>
      <TasksKanbanSection/>
      <TasksTemplatesSection/>
      <PropertiesSection/>
      <Divider/>
      <DemoSection/>
    </Page>
  )
}

export default Tasks
