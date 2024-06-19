import type { NextPage } from 'next'
import { MediQuuHeaderSection } from '@/components/sections/mediQuu/Header'
import { MediQuuInformationSection } from '@/components/sections/mediQuu/InformationSection'
import { BrandDescriptionsSection } from '@/components/sections/mediQuu/BrandInformationSection'
import { RoadmapSection } from '@/components/sections/mediQuu/RoadmapSection'
import { TeamSection } from '@/components/sections/mediQuu/TeamSection'
import { MediQuuFAQSection } from '@/components/sections/mediQuu/MediQuuFAQ'
import { ContactSection } from '@/components/sections/mediQuu/ContactSection'
import { Page } from '@/components/Page'

const MediQuuPage: NextPage = () => {
  return (
    <Page>
      <MediQuuHeaderSection/>
      <MediQuuInformationSection/>
      <BrandDescriptionsSection/>
      <TeamSection/>
      <RoadmapSection/>
      <MediQuuFAQSection/>
      <ContactSection/>
    </Page>
  )
}

export default MediQuuPage
