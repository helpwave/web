import { Button } from '@helpwave/common/components/Button'
import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { DescriptionWithAction } from '@helpwave/common/components/DescriptionWithAction'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

type LandingPageTranslation = {
  tryTheDemo: string,
  discoverOurVision: string,
  mediQuuCTAtitle: string,
  mediQuuCTAdescription: string,
  readLater: string
}

const defaultLandingPageTranslation: Record<Languages, LandingPageTranslation> = {
  en: {
    tryTheDemo: 'Try the demo!',
    discoverOurVision: 'Discover Our Vision',
    mediQuuCTAtitle: 'mediQuu becomes helpwave',
    mediQuuCTAdescription: 'With great pleasure, we announce the acquisition of mediQuu by helpwave.',
    readLater: 'Read more'
  },
  de: {
    tryTheDemo: 'Teste die Demo!',
    discoverOurVision: 'Entdecken unsere Vision',
    mediQuuCTAtitle: 'Aus mediQuu wird helpwave',
    mediQuuCTAdescription: 'Mit großer Freude geben wir die Akquisition von mediQuu durch helpwave bekannt.',
    readLater: 'Weiterlesen'
  }
}

const StartSection = ({ overwriteTranslation }: PropsForTranslation<LandingPageTranslation>) => {
  const translation = useTranslation(defaultLandingPageTranslation, overwriteTranslation)
  const exploreURL = '/join'
  const demoURL = 'https://staging-tasks.helpwave.de'
  return (
    <div className={tw('pt-32 pb-16')}>
      <div className={tw('flex gap-32 items-center justify-center mb-8')}>
        <div className={tw('desktop:w-3/4')}>
          <div className={tw('font-space text-6xl font-bold')}>helpwave</div>

          <div className={tw('font-sans text-2xl font-medium mt-2 text-end')}>
            {'empowering '}
            <span className={tw('text-hw-primary-800')}>{'medical heroes'}</span>
            {', '}
            <br className={tw('mobile:hidden')}/>
            {'united in '}
            <span className={tw('text-green-600')}>{'technology'}</span>
          </div>

          <div className={tw('flex my-8 gap-8 justify-end')}>
            <Button variant="tertiary" color="warn" onClick={() => { window.location.href = exploreURL }}>
              {translation.discoverOurVision}
            </Button>

            <Button variant="textButton" color="neutral" onClick={() => { window.open(demoURL, '_blank') }}>
              {translation.tryTheDemo}
            </Button>
          </div>
        </div>
      </div>

      <DescriptionWithAction
        title={translation.mediQuuCTAtitle}
        description={translation.mediQuuCTAdescription}
        trailing={(
          <div
            className={tw('flex flex-row items-center desktop:justify-end mobile:justify-center grow desktop:pl-2 mobile:pt-2')}>
            <Link
              href="mediquu"
              className={tw('flex flex-row gap-x-4 whitespace-nowrap px-4 py-2 text-white bg-hw-primary-800 rounded-md')}
            >
              {translation.readLater}...
              <MessageSquare/>
            </Link>
          </div>
        )}
        className={tw('!bg-gray-200 !py-4 !px-8 shadow')}
        descriptionClassName={tw('!text-gray-600')}
      />

      <div className={tw('mobile:hidden w-2/7')}>
      </div>
    </div>
  )
}

export default StartSection
