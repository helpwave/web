import type { NextPage } from 'next'
import { TechRadar as TechRadarComponent } from '@helpwave/hightide'
import { Page } from '@/components/Page'

const TechRadar: NextPage = () => {
  return (
    <Page pageTitleAddition="tech radar">
      <div className="mt-16 items-center justify-center">
        <TechRadarComponent/>
      </div>
    </Page>
  )
}

export default TechRadar
