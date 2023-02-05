import { forwardRef } from 'react'
import type { FC as ReactFC } from 'react'
import { tw } from '@helpwave/common/twind/index'
import Header from '../Header'
import Helpwave from '../../icons/HelpwaveRect'
import { Checkbox } from '../Checkbox'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

export type StartSectionLanguage = {
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

const defaultStartSectionLanguage: Record<Languages, StartSectionLanguage> = {
  en: {
    HeroMessageComponent: () => (
      <>
        {"At helpwave, we don't develop software for healthcare workers but with them."}<br />
        {'In this collective of doctors, developers and other bright minds,'}<br />
        {'we develop '}
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

const StartSection = forwardRef<HTMLDivElement, PropsWithLanguage<StartSectionLanguage, Record<string, unknown>>>(function StartSection(props, ref) {
  const language = useTranslation(props.language, defaultStartSectionLanguage)
  return (
    <div className={tw('w-full h-screen bg-hw-dark-gray-600 text-white')} id="start" ref={ref}>
      <div className={tw('py-8 px-16')}>
        <Header />
      </div>
      <div className={tw('relative top-[30vh] m-auto w-[580px]')}>
        <div className={tw('flex justify-between')}>
          <div className={tw('font-space text-7xl font-bold')}>helpwave</div>
          <Helpwave className={tw('align-center')} height="72" width="96" />
        </div>

        <div className={tw('font-sans text-2xl font-medium mt-4')}>
          <language.HeroMessageComponent />
        </div>

        <div className={tw('p-4 flex gap-16')}>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-1" label={language.features.intuitive} /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-2" label={language.features.collaborative} /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-3" label={language.features.practical} /></div>
          </div>
          <div className={tw('flex flex-col')}>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-4" label={language.features.secure} /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-5" label={language.features.interdisciplinary} /></div>
            <div className={tw('p-2')}><Checkbox checked={true} onChange={() => undefined} disabled id="feature-6" label={language.features.openSource} /></div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default StartSection
