import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import StartSection from '../../../components/sections/tasks/StartSection'

const Tasks: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <StartSection />
      </div>
      <Footer />
    </div>
  )
}

export default Tasks
