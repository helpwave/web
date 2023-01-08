import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'

const PartnerSection = forwardRef<HTMLDivElement>(function PartnerSection(_, ref) {
  return (
    <TitleSection id="partner" ref={ref} title="Our Partners">
      idk
    </TitleSection>
  )
})

export default PartnerSection
