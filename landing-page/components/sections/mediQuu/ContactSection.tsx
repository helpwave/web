import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useState } from 'react'
import { validateEmail } from '@helpwave/common/util/emailValidation'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import { Button } from '@helpwave/common/components/Button'

type ContactSectionTranslation = {
  contact: string,
  contactDescription: string,
  firstname: string,
  lastname: string,
  email: string,
  message: string,
  send: string
}

const defaultContactSectionTranslation: Record<Languages, ContactSectionTranslation> = {
  en: {
    contact: 'Contact',
    contactDescription: 'We are available to answer any questions you may have at short notice.',
    firstname: 'First Name',
    lastname: 'Last Name',
    email: 'E-Mail',
    message: 'Your Message',
    send: 'Send Message'
  },
  de: {
    contact: 'Kontakt',
    contactDescription: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
    firstname: 'Vorname',
    lastname: 'Nachname',
    email: 'E-Mail',
    message: 'Ihre Nachricht',
    send: 'Nachricht senden'
  }
}

type Contact = {
  name: string,
  email: string
}

type ContactForm = {
  firstname: string,
  lastname: string,
  email: string,
  message: string
}

const contacts: Contact[] = [
  {
    name: 'Dr. med. Christian Porschen',
    email: 'contact@helpwave.de'
  }
]
/**
 * The section on the mediquu page for contacting helpwave
 */
export const ContactSection = ({
  overwriteTranslation,
}: PropsForTranslation<ContactSectionTranslation>) => {
  const translation = useTranslation(defaultContactSectionTranslation, overwriteTranslation)
  const [contactForm, updateContactForm] = useState<ContactForm>({
    firstname: '',
    lastname: '',
    email: '',
    message: '',
  })

  const isValid = !!contactForm.firstname && !!contactForm.lastname && validateEmail(contactForm.email) && !!contactForm.message

  return (
    // TODO optimize layout for mobile when ready
    <div className={tw('flex desktop:flex-row desktop:justify-between w-full max-w-[1000px] mobile:flex-col gap-8')}>
      <div className={tw('flex flex-col gap-y-1 desktop:w-1/2')}>
        <Span type="title" className={tw('text-hw-secondary-400 !text-3xl')}>{translation.contact}</Span>
        <Span>{translation.contactDescription}</Span>
        {contacts.length > 0 && (
          <div className={tw('flex flex-col gap-y-6 mt-6')}>
            {contacts.map((contact, index) => (
              <div key={index} className={tw('flex flex-col gap-y-1')}>
                <Span className={tw('font-bold')}>{contact.name}</Span>
                <Span>{contact.email}</Span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={tw('flex flex-col gap-y-2 desktop:w-1/2')}>
        <Input
          value={contactForm.firstname}
          placeholder={translation.firstname}
          onChange={firstname => updateContactForm(prevState => ({ ...prevState, firstname }))}
        />
        <Input
          value={contactForm.lastname}
          placeholder={translation.lastname}
          onChange={lastname => updateContactForm(prevState => ({ ...prevState, lastname }))}
        />
        <Input
          value={contactForm.email}
          placeholder={translation.email}
          onChange={email => updateContactForm(prevState => ({ ...prevState, email }))}
        />
        <Textarea
          value={contactForm.message}
          placeholder={translation.message}
          onChange={message => updateContactForm(prevState => ({ ...prevState, message }))}
        />
        <Button
          color="accent-secondary"
          onClick={() => {
            // TODO send form information here
          }}
          disabled={!isValid}
          className={tw('py-4')}
        >
          {translation.send}
        </Button>
      </div>
    </div>
  )
}
