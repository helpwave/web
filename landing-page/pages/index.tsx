import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { DescriptionWithAction } from '@helpwave/common/components/DescriptionWithAction'
import Link from 'next/link'
import { MousePointerClick } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ExpansionSection from '../components/sections/landing/ExpansionSection'
import PartnerSection from '../components/sections/landing/Partners'
import StartSection from '../components/sections/landing/StartSection'
import StorySection from '../components/sections/landing/Story'

type HomePageTranslation = {
  checkOutFirstProduct: string,
  checkOutFirstProductDescription: string,
  helpwaveTasks: string
}

const defaultHomePageTranslation: Record<Languages, HomePageTranslation> = {
  en: {
    checkOutFirstProduct: 'Check out our first product',
    checkOutFirstProductDescription: 'and how helpwave tasks increases productivity for our medical heroes',
    helpwaveTasks: 'helpwave tasks'
  },
  de: {
    checkOutFirstProduct: 'Sieh dir unser erstes Produkt an',
    checkOutFirstProductDescription: 'und wie helpwave tasks die Producktivität unserer medical heroes verbessert',
    helpwaveTasks: 'helpwave tasks'
  }
}

const Home: NextPage = ({ overwriteTranslation }: PropsForTranslation<HomePageTranslation>) => {
  const translation = useTranslation(defaultHomePageTranslation, overwriteTranslation)

  const sectionClassName = tw('desktop:max-w-[1200px] mx-auto desktop:px-24 tablet:px-12 mobile:px-6 relative z-[1]')

  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw(sectionClassName)}>
        <StartSection/>
      </div>
      <Divider rotate={1}/>
      <div className={tw(sectionClassName)}>
        <PartnerSection/>
      </div>
      <Divider rotate={1}/>
      <div className={tw(sectionClassName)}>
        <StorySection/>
      </div>
      <div className={tw('relative flex flex-col items-center')}>
        <div className={tw('desktop:w-[620px] mx-20')}>
          <DescriptionWithAction
            // TODO translation
            title={`${translation.checkOutFirstProduct}...`}
            description={`...${translation.checkOutFirstProductDescription}`}
            trailing={(
              <div
                className={tw('flex flex-row items-center desktop:justify-end mobile:justify-center grow desktop:pl-2 mobile:pt-2')}>
                <Link
                  href="product/tasks"
                  className={tw('flex flex-row gap-x-4 whitespace-nowrap px-4 py-2 text-white bg-hw-primary-800 rounded-md')}
                >
                  {translation.helpwaveTasks}
                  <MousePointerClick/>
                </Link>
              </div>
            )}
            className={tw('!bg-gray-200 !py-4 !px-8 shadow')}
            descriptionClassName={tw('!text-gray-600')}
          />
        </div>
        <div className={tw('absolute h-1/2 w-full top-1/2 bg-hw-primary-900 z-[-1] translate-y-[2px]')}></div>
      </div>
      <div className={tw('!bg-hw-primary-900 text-white')}>
        <div className={tw(sectionClassName)}>
          <ExpansionSection/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
