import { forwardRef } from 'react'
import { tw } from '@twind/core'
import { TitleSection } from '../Section'
import GridBox from '../GridBox'
import ContactForm from '../ContactForm'

const ContactSection = forwardRef<HTMLDivElement>(function ContactSection(_, ref) {
  return (
    <TitleSection id="contact" ref={ref} title="Contact">
      <div className={tw('flex justify-center')}>
        <GridBox childrenSurroundingClassName='bg-white'>
            <ContactForm/>
        </GridBox>
      </div>
    </TitleSection>
  )
})

export default ContactSection
