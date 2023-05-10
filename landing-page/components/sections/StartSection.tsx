import { forwardRef } from 'react'
import type { FC as ReactFC } from 'react'
import { tw } from '@helpwave/common/twind'
import Footer from '../Footer'
import Helpwave from '../../icons/HelpwaveRect'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

export type StartSectionTranslation = {
  HeroMessageComponent: ReactFC,
  features: {
    intuitive: string,
    collaborative: string,
    practical: string,
    secure: string,
    interdisciplinary: string,
    openSource: string
  }
}

const defaultStartSectionTranslations: Record<Languages, StartSectionTranslation> = {
  en: {
    HeroMessageComponent: () => (
      <>
        {'develops '}
        <span className={tw('text-hw-primary-400')}>{'real'}</span>
        {' solutions for '}
        <span className={tw('text-hw-pool-red')}>{'real'}</span>
        {' people'}
      </>
    ),
    features: {
      intuitive: 'Intuitive',
      collaborative: 'Collaborative',
      practical: 'Practical',
      secure: 'Secure',
      interdisciplinary: 'Interdisciplinary',
      openSource: 'Open Source'
    }
  },
  de: {
    HeroMessageComponent: () => (
      <>
        {'Bei helpwave entwickeln wir keine Software für das Gesundheitssystem, sondern mit ihm. '}<br />
        {'In diesem Zusammenschluss aus Ärzten, Entwicklern und weiteren frischen Geistern, '}<br />
        {'entstehen '}
        <span className={tw('text-hw-primary-400')}>{'echte'}</span>
        {' Lösungen für '}
        <span className={tw('text-hw-pool-red')}>{'echte'}</span>
        {' Menschen.'}
      </>
    ),
    features: {
      intuitive: 'Intuitiv',
      collaborative: 'Kollaborativ',
      practical: 'Praxisnah',
      secure: 'Sicher',
      interdisciplinary: 'Interprofessionell',
      openSource: 'Open Source'
    }
  }
}

const StartSection = forwardRef<HTMLDivElement, PropsWithLanguage<StartSectionTranslation>>(function StartSection({ language }, ref) {
  const translation = useTranslation(language, defaultStartSectionTranslations)
  return (
    <div className={tw('w-screen h-screen bg-white')} id="start" ref={ref}>
      <Helpwave className={tw('absolute top-[25px] left-1/2 -translate-x-1/2')} height="72" width="96" />
      <div className={tw('relative top-[40vh] m-auto')}>
          <div className={tw('font-space text-6xl font-bold text-center')}>helpwave</div>

        <div className={tw('font-sans text-2xl font-medium mt-2 text-center')}>
          <translation.HeroMessageComponent />
        </div>
      </div>
      <Footer />
    </div>
  )
})

export default StartSection
