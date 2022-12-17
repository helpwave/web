import GridBox from './GridBox'
import ContactForm from './ContactForm'

const ContactSection = () => {
  return (
    <div id="contact">
      <div className="w-screen h-screen bg-white">
        <div className="flex justify-center p-8">
          <GridBox heading={<h1 className="text-5xl font-space font-bold pl-4 pb-4">Contact us</h1>}>
            <ContactForm/>
          </GridBox>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
