import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import Script from 'next/script'

const ContactForm: FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.hbspt.forms.create({
      region: 'eu1',
      portalId: '26536657',
      formId: 'e5271b1a-1ab8-472b-aae1-d4e3ab52fab7',
      target: '#hubspot-contact-us-form'
    })
  }, [loaded])

  return (
    <>
      <Script
        src="https://js-eu1.hsforms.net/forms/embed/v2.js"
        onLoad={() => setLoaded(true)}
      />
      <div id="hubspot-contact-us-form" />
    </>
  )
}

export default ContactForm
