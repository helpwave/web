import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import GridBox from '../GridBox'
import ContactForm from '../ContactForm'

const ContactSection = forwardRef<HTMLDivElement>(function ContactSection(_, ref) {
  return (
    <TitleSection id="contact" ref={ref} title="Contact">
      <div className={tw('flex justify-center')}>
        <GridBox heading={<h1 className={tw('text-5xl font-space font-bold pl-4 pb-4')}></h1>}>
            <ContactForm/>
        </GridBox>
      </div>
    </TitleSection>
  )
})

export default ContactSection
