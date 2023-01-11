import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'

const RoadmapSection = forwardRef<HTMLDivElement>(function RoadmapSection(_, ref) {
  return (
    <TitleSection id="roadmap" ref={ref} title="Roadmap">

    </TitleSection>
  )
})

export default RoadmapSection
