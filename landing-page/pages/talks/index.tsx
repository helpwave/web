import type { NextPage } from 'next'
import EpisodeSection from '@/components/sections/talks/EpisodeSection'
import StartSection from '@/components/sections/talks/StartSection'
import { Page } from '@/components/Page'

const Talks: NextPage = () => {
  return (
    <Page>
      <StartSection/>
      <EpisodeSection/>
    </Page>
  )
}

export default Talks
