import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import StadtWarendorf from '../../icons/partners/StadtWarendorf'
import Ukm from '../../icons/partners/ukm'
import MSHack from '../../icons/partners/MSHack'

const partners = [
  { name: 'Stadt Warendorf', Icon: StadtWarendorf },
  { name: 'Uniklinik Münster', Icon: Ukm },
  { name: 'Muensterhack', Icon: MSHack }
]

const PartnerSection = forwardRef<HTMLDivElement>(function PartnerSection(_, ref) {
  return (
    <TitleSection id="partner" ref={ref} title="Our Partners">
      <div className={tw('flex gap-4 pt-4')}>
      {partners.map((partner) => (
        <div key={partner.name} className={tw('py-2 px-8 bg-white rounded-lg')}>
          <partner.Icon className={tw('w-44 h-16')} />
        </div>
      ))}
      </div>
    </TitleSection>
  )
})

export default PartnerSection
