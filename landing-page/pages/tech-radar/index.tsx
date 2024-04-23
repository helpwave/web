import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { TechRadar as TechRadarComponent } from '@helpwave/common/components/TechRadar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const TechRadar: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('mt-16 flex items-center justify-center')}>
        <TechRadarComponent/>
      </div>
      <Footer />
    </div>
  )
}

export default TechRadar
