import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { TechRadar as TechRadarComponent } from '@helpwave/common/components/TechRadar'
import { Page } from '@/components/Page'

const TechRadar: NextPage = () => {
  return (
    <Page pageTitleAddition="Tech Radar">
      <div className={tw('mt-16 flex items-center justify-center')}>
        <TechRadarComponent/>
      </div>
    </Page>
  )
}

export default TechRadar
