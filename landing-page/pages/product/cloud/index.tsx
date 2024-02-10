import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const Cloud: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('pt-32 pb-16')}>
        <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
          <h1 className={tw('font-space text-6xl font-bold')}>
            helpwave <span className={tw('text-hw-primary-800')}>cloud</span>
          </h1>
          <div className={tw('w-full min-h-[1000px]')} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Cloud
