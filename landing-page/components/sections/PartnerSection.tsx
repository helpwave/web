import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import StadtWarendorf from '../../icons/partners/StadtWarendorf'
import Ukm from '../../icons/partners/ukm'
import MSHack from '../../icons/partners/MSHack'

const partners = [
  { name: 'Muensterhack', icon: MSHack, url: 'https://www.muensterhack.de/' },
  { name: 'Uniklinik Münster', icon: Ukm, url: 'https://www.ukm.de/' },
  { name: 'Stadt Warendorf', icon: StadtWarendorf, url: 'https://www.warendorf.de/' },
]

const PartnerSection = forwardRef<HTMLDivElement>(function PartnerSection(_, ref) {
  return (
    <TitleSection id="partner" ref={ref} title="Our Partners">
      <div className={tw('flex gap-4 pt-4')}>
      {partners.map((partner) => (
        <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer">
          <div className={tw('py-2 px-8 bg-white rounded-lg')}>
            <partner.icon className={tw('w-44 h-16')} />
          </div>
        </a>
      ))}
      </div>
    </TitleSection>
  )
})

export default PartnerSection
