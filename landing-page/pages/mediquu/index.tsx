import type { NextPage } from 'next'
import { tw } from '@helpwave/common/twind'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MediQuuHeaderSection } from '@/components/sections/mediQuu/Header'
import { MediQuuInformationSection } from '@/components/sections/mediQuu/InformationSection'
import { BrandDescriptionsSection } from '@/components/sections/mediQuu/BrandInformationSection'
import { TeamSection } from '@/components/sections/mediQuu/TeamSection'
import { MediQuuFAQSection } from '@/components/sections/mediQuu/MediQuuFAQ'
import { ContactSection } from '@/components/sections/mediQuu/ContactSection'

const MediQuuPage: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('w-full min-h-full pt-16')}>
        <div className={tw('flex flex-col w-full bg-gray-100 py-16 items-center desktop:px-16 mobile:px-8')}>
          <MediQuuHeaderSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 items-center desktop:px-16 mobile:px-8')}>
          <MediQuuInformationSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 bg-gray-100 items-center desktop:px-16 mobile:px-8')}>
          <BrandDescriptionsSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 items-center desktop:px-16 mobile:px-8')}>
          <TeamSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 bg-gray-100 items-center desktop:px-16 mobile:px-8')}>
          <MediQuuFAQSection/>
        </div>
        <div className={tw('flex flex-col w-full py-16 bg-gray-100 items-center desktop:px-16 mobile:px-8')}>
          <ContactSection/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default MediQuuPage
