import { forwardRef } from 'react'
import { TitleSection } from '../Section'

const FeaturesSection = forwardRef<HTMLDivElement>(function FeaturesSection(_, ref) {
  return (
    <TitleSection ref={ref} id="features" title="Solve real world problems">

    </TitleSection>
  )
})

export default FeaturesSection
