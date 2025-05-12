import type { NextPage } from 'next'
import { Page } from '@/components/Page'

const Impulse: NextPage = () => {
  return (
    <Page pageTitleAddition="impulse">
      <div className="pt-32 pb-16">
        <div className="desktop:w-5/12 desktop:mx-auto max-tablet:mx-8 relative z-[1]">
          <h1 className="font-space text-6xl font-bold">
            helpwave <span className="text-primary">impulse</span>
          </h1>
          <div className="w-full min-h-[1000px]"/>
        </div>
      </div>
    </Page>
  )
}

export default Impulse
