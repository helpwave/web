import type { NextPage } from 'next'
import { Header } from '../components/Header'

const ContactPage: NextPage = () => {
  return (
    <div>

      <Header title="helpwave" navigation={[
        { text: 'Dashboard', href: '/' },
        { text: 'Contact', href: '/contact' }
      ]} />
      not sure how this is going to look, just a placeholder right now
    </div>
  )
}

export default ContactPage
