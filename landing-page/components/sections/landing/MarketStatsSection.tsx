import { tw } from '@helpwave/common/twind'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { Span } from '@helpwave/common/components/Span'
import type { PropsWithChildren } from 'react'
import Image from 'next/image'
import { SectionBase } from '@/components/sections/SectionBase'

type MarketStatsItemProps = PropsWithChildren<{
  stat: string,
  title: string
}>

const MarketStatsItem = ({ children, stat, title }: MarketStatsItemProps) => {
  return (
    <div className={tw('flex flex-col items-center')}>
      {children}
      <Span className={tw('text-3xl mobile:text-xl mt-2 mobile:font-semibold')}>{stat}</Span>
      <h4><Span type="description" className={tw('text-xl mobile:!text-base')}>{title}</Span></h4>
    </div>
  )
}

type MarketStatsSectionTranslation = {
  germanyHealthcareSystem: string,
  marketPotential: string,
  hospitals: string,
  healthcareWorkers: string,
  gdp: string
}

const defaultExpansionTranslation: Record<Languages, MarketStatsSectionTranslation> = {
  en: {
    germanyHealthcareSystem: 'Germany\'s Healthcare System',
    marketPotential: 'Market Potential',
    hospitals: 'hospitals',
    healthcareWorkers: 'healthcare workers',
    gdp: 'of GDP'
  },
  de: {
    germanyHealthcareSystem: 'Deutsches Gesundheitssystem',
    marketPotential: 'Markt Potential',
    hospitals: 'Krankenhäuser',
    healthcareWorkers: 'healthcare worker',
    gdp: 'des BIP'
  }
}

const MarketStatsSection = ({ overwriteTranslation }: PropsForTranslation<MarketStatsSectionTranslation>) => {
  const translation = useTranslation(defaultExpansionTranslation, overwriteTranslation)
  return (
    <SectionBase backgroundColor="darkSecondary" className={tw('flex flex-col text-white pb-24 font-space')}>
      <h1 className={tw('w-full text-3xl text-center font-space')}>{translation.germanyHealthcareSystem}</h1>
      <Span type="description" className={tw('text-center')}>{translation.marketPotential}</Span>
      <div className={tw('mt-8 w-full flex flex-wrap gap-y-16 gap-x-32 justify-evenly items-center')}>
        <MarketStatsItem stat="1.800" title={translation.hospitals}>
          {/* Image needs attribution to https://www.flaticon.com/free-icon/hospital_3809392?term=hospital&page=1&position=8&origin=search&related_id=3809392 */}
          <Image width={72} height={72} alt="" src="https://cdn.helpwave.de/icons/hospital.png" className={tw('w-[72px] h-[72px] mobile:w-[48px] mobile:h-[48px] p-[5%]')}/>
        </MarketStatsItem>

        <MarketStatsItem stat="1.000.000" title={translation.healthcareWorkers}>
          {/* Image needs attribution to https://www.flaticon.com/free-icon/hospital_3809392?term=hospital&page=1&position=8&origin=search&related_id=3809392 */}
          <Image width={72} height={72} alt="" src="https://cdn.helpwave.de/icons/doctors.png" className={tw('w-[72px] h-[72px] mobile:w-[48px] mobile:h-[48px]')}/>
        </MarketStatsItem>

        <MarketStatsItem stat="12,1%" title={translation.gdp}>
          {/* Image needs attribution to https://www.freepik.com/icon/donut-chart_483638 */}
          <Image width={72} height={72} alt="" src="https://cdn.helpwave.de/icons/pie_chart.png" className={tw('w-[72px] h-[72px] mobile:w-[48px] mobile:h-[48px]')}/>
        </MarketStatsItem>
      </div>
    </SectionBase>
  )
}

export default MarketStatsSection
