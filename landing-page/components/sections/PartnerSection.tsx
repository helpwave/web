import { forwardRef } from 'react'
import { tw } from '@helpwave/common/twind/index'
import { TitleSection } from '../Section'
import StadtWarendorf from '../../icons/partners/StadtWarendorf'
import Ukm from '../../icons/partners/ukm'
import MSHack from '../../icons/partners/MSHack'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

const partners = [
  { name: 'Muensterhack', Icon: MSHack, url: 'https://www.muensterhack.de/' },
  { name: 'Uniklinik Münster', Icon: Ukm, url: 'https://www.ukm.de/' },
  { name: 'Stadt Warendorf', Icon: StadtWarendorf, url: 'https://www.warendorf.de/' },
]

export type PartnerSectionLanguage = {
  heading: string
}

const defaultPartnerSectionTranslations: Record<Languages, PartnerSectionLanguage> = {
  en: {
    heading: 'Our Partners',
  },
  de: {
    heading: 'Unsere Partner',
  }
}

const PartnerSection = forwardRef<HTMLDivElement, PropsWithLanguage<PartnerSectionLanguage, Record<string, unknown>>>(function PartnerSection(props, ref) {
  const language = useTranslation(props.language, defaultPartnerSectionTranslations)
  return (
    <TitleSection id="partner" ref={ref} title={language.heading}>
      <div className={tw('flex gap-4 pt-4')}>
      {partners.map((partner) => (
        <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer">
          <div className={tw('py-2 px-8 bg-white rounded-lg')}>
            <partner.Icon className={tw('w-44 h-16')} />
          </div>
        </a>
      ))}
      </div>
    </TitleSection>
  )
})

export default PartnerSection
