import { Button } from '@helpwave/common/components/Button'
import { tw } from '@helpwave/common/twind'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type LandingPageTranslation = {
  tryTheDemo: string,
  discoverOurVision: string
}

const defaultLandingPageTranslation: Record<Languages, LandingPageTranslation> = {
  en: {
    tryTheDemo: 'Try the demo!',
    discoverOurVision: 'Discover Our Vision'
  },
  de: {
    tryTheDemo: 'Teste die Demo!',
    discoverOurVision: 'Entdecken unsere Vision'
  }
}

const StartSection = ({ language }: PropsWithLanguage<landingPageTranslation>) => {
  const translation = useTranslation(language, defaultLandingPageTranslation)
  const exploreURL = '/story'
  const demoURL = 'https://staging-tasks.helpwave.de'

  return (
    <div className={tw('pt-32 pb-16 flex gap-32 items-center justify-center')}>
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

        <div className={tw('flex my-8 gap-8 justify-end mobile:justify-evenly')}>
          <Button variant="tertiary" color="warn" onClick={() => { window.location.href = exploreURL }}>
            {translation.discoverOurVision}
          </Button>

          <Button variant="textButton" color="neutral" onClick={() => { window.open(demoURL, '_blank') }}>
            {translation.tryTheDemo}
          </Button>
        </div>
      </div>

      <div className={tw('mobile:hidden w-2/7')}>
      </div>
    </div>
  )
}

export default StartSection
