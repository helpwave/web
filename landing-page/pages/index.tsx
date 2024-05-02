import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { DescriptionWithAction } from '@helpwave/common/components/DescriptionWithAction'
import Link from 'next/link'
import { MousePointerClick } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import ExpansionSection from '../components/sections/landing/ExpansionSection'
import PartnerSection from '../components/sections/landing/Partners'
import StartSection from '../components/sections/landing/StartSection'
import StorySection from '../components/sections/landing/Story'
import { Page } from '@/components/Page'

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

  return (
    <Page outerClassName={tw('z-0')} className={tw('z-0')}>
      <StartSection/>
      <PartnerSection/>
      <StorySection/>
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
      <ExpansionSection/>
    </Page>
  )
}

export default Home
