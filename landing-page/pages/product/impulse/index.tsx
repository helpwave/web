import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'

const Scaffold: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header />
      <Footer />
    </div>
  )
}

export default Scaffold
