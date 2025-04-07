import { tw } from '@helpwave/style-themes/twind'
import type { NextPage } from 'next'
import { Page } from '@/components/Page'

const Analytics: NextPage = () => {
  return (
    <Page pageTitleAddition="analytics">
      <div className={tw('pt-32 pb-16')}>
        <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
          <h1 className={tw('font-space text-6xl font-bold')}>
            helpwave <span className={tw('text-hw-primary-800')}>analytics</span>
          </h1>
          <div className={tw('w-full min-h-[1000px]')} />
        </div>
      </div>
    </Page>
  )
}

export default Analytics
