import type { NextPage } from 'next'
import { Page } from '@/components/Page'

const Analytics: NextPage = () => {
  return (
    <Page pageTitleAddition="analytics">
      <div className="pt-32 pb-16">
        <div className="desktop:w-5/12 desktop:mx-auto max-tablet:mx-8 relative z-[1]">
          <h1 className="font-space text-6xl font-bold">
            helpwave <span className="text-primary">analytics</span>
          </h1>
          <div className="w-full min-h-[1000px]" />
        </div>
      </div>
    </Page>
  )
}

export default Analytics
