import type { NextPage } from 'next'
import { tw } from '@helpwave/common/twind/index'
import { Header } from '../components/Header'

const ContactPage: NextPage = () => {
  return (
    <div>

      <Header
        title="helpwave"
        navigation={[
          { text: 'Dashboard', href: '/' },
          { text: 'Contact', href: '/contact' }
        ]}
        actions={[
          <div key="0" className={tw('w-40')} />
        ]}
      />
      not sure how this is going to look, just a placeholder right now
    </div>
  )
}

export default ContactPage
