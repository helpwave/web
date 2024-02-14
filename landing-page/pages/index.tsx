import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { DescriptionWithAction } from '@helpwave/common/components/DescriptionWithAction'
import Link from 'next/link'
import { MousePointerClick } from 'lucide-react'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ExpansionSection from '../components/sections/landing/ExpansionSection'
import PartnerSection from '../components/sections/landing/Partners'
import StartSection from '../components/sections/landing/StartSection'
import StorySection from '../components/sections/landing/Story'

const Home: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <StartSection/>
      </div>
      <Divider rotate={1}/>
      <div className={tw('desktop:w-5/12 desktop:mx-auto tablet:mx-16 phone:mx-8 relative z-[1]')}>
        <PartnerSection/>
      </div>
      <Divider rotate={1}/>
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <StorySection/>
      </div>
      <div className={tw('w-screen parent bg-hw-primary-900 relative')}>
        <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 pt-16 text-white')}>
          <ExpansionSection/>
        </div>
        <div className={tw('absolute z-[2] w-[600px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2')}>
          <DescriptionWithAction
            // TODO translation
            title="Check out our first product..."
            description="...and how helpwave tasks increases productivity for our medical heroes"
            trailing={(
              <div className={tw('flex flex-row items-center justify-end grow pl-2')}>
                <Link
                  href="product/tasks"
                  className={tw('flex flex-row gap-x-4 whitespace-nowrap px-4 py-2 text-white bg-hw-primary-800 rounded-md')}
                >
                  helpwave tasks
                  <MousePointerClick/>
                </Link>
              </div>
            )}
            className={tw('!bg-gray-200')}
            descriptionClassName={tw('!text-gray-600')}
          />
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
