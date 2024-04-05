import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import TeamSection from '@/components/sections/team/TeamSection'

const Team: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:max-w-[1200px] desktop:mx-auto desktop:px-16 mobile:mx-8 relative z-[1]')}>
        <TeamSection />
      </div>
      <Footer />
    </div>
  )
}

export default Team
