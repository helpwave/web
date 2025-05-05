import clsx from 'clsx'
import type { NextPage } from 'next'
import { TechRadar as TechRadarComponent } from '@helpwave/common/components/TechRadar'
import { Page } from '@/components/Page'

const TechRadar: NextPage = () => {
  return (
    <Page pageTitleAddition="tech radar">
      <div className={clsx('mt-16 items-center justify-center')}>
        <TechRadarComponent/>
      </div>
    </Page>
  )
}

export default TechRadar
