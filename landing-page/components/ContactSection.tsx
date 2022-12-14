import { useEffect, useState } from 'react'
import Script from 'next/script'
import GridBox from './GridBox'

const ContactSection = () => {
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
    <div id="contact">
      <div className="w-screen h-screen bg-white">
        <div className="flex justify-center p-8">
          <GridBox heading={<h1 className="text-5xl font-space font-bold pl-4 pb-4">Contact us</h1>}>
            <Script
              src="https://js-eu1.hsforms.net/forms/embed/v2.js"
              onLoad={() => setLoaded(true)}
            />
            <div id="hubspot-contact-us-form" />
          </GridBox>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
