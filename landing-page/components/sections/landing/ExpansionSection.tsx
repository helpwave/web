import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type ExpansionSectionTranslation = {
  germanyHealthcareSystem: string,
  hospitals: string,
  healthcareWorkers: string,
  gdp: string
}

const defaultExpansionTranslation: Record<Languages, ExpansionSectionTranslation> = {
  en: {
    germanyHealthcareSystem: 'Germany\'s Healthcare System',
    hospitals: 'hospitals',
    healthcareWorkers: 'healthcare workers',
    gdp: 'of GDP'
  },
  de: {
    germanyHealthcareSystem: 'Deutsches Gesundheitssystem',
    hospitals: 'Krankenhäuser',
    healthcareWorkers: 'healthcare worker',
    gdp: 'des BIP'
  }
}

const ExpansionSection = ({ overwriteTranslation }: PropsForTranslation<ExpansionSectionTranslation>) => {
  const translation = useTranslation(defaultExpansionTranslation, overwriteTranslation)
  return (
    <div className={tw('py-16')}>
        <h1 className={tw('w-full text-3xl text-center font-space')}>{translation.germanyHealthcareSystem}</h1>

        <div className={tw('mt-8 w-full flex flex-wrap gap-16 justify-evenly items-center')}>
          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>1.800</span>
            <br />
            <h4>{translation.hospitals}</h4>
          </div>

          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>1.000.000</span>
            <br />
            <h4>{translation.healthcareWorkers}</h4>
          </div>

          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>12,1%</span>
            <br />
            <h4>{translation.gdp}</h4>
          </div>
        </div>
    </div>
  )
}

export default ExpansionSection
