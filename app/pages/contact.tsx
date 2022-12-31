import type { NextPage } from 'next'
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
          <div key="0" className="w-40" />
        ]}
      />
      not sure how this is going to look, just a placeholder right now
    </div>
  )
}

export default ContactPage
