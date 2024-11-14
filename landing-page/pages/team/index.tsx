import type { NextPage } from 'next'
import TeamSection from '@/components/sections/team/TeamSection'
import { Page } from '@/components/Page'

const Team: NextPage = () => {
  return (
    <Page pageTitleAddition="team">
      <TeamSection/>
    </Page>
  )
}

export default Team
