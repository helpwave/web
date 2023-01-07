import { tw } from '@twind/core'
import GridBox from './GridBox'
import ContactForm from './ContactForm'
import { Section } from './Section'

const ContactSection = () => {
  return (
    <Section id="contact">
        <div className={tw('flex justify-center')}>
          <GridBox heading={<h1 className={tw('text-5xl font-space font-bold pl-4 pb-4')}>Contact us</h1>}>
              <ContactForm/>
          </GridBox>
        </div>
    </Section>
  )
}

export default ContactSection
