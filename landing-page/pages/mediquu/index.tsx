import type { NextPage } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
      <Header/>
      <MediQuuHeaderSection/>
      <MediQuuInformationSection/>
      <BrandDescriptionsSection/>
      <TeamSection/>
      <RoadmapSection/>
      <MediQuuFAQSection/>
      <ContactSection/>
      <Footer/>
    </Page>
  )
}

export default MediQuuPage
