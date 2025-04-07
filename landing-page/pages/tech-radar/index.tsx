import { tw } from '@helpwave/style-themes/twind'
import type { NextPage } from 'next'
import { TechRadar as TechRadarComponent } from '@helpwave/common/components/TechRadar'
import { Page } from '@/components/Page'

const TechRadar: NextPage = () => {
  return (
    <Page pageTitleAddition="tech radar">
      <div className={tw('mt-16 flex items-center justify-center')}>
        <TechRadarComponent/>
      </div>
    </Page>
  )
}

export default TechRadar
