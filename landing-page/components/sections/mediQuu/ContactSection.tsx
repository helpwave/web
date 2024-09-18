import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'
import { useState } from 'react'
import { validateEmail } from '@helpwave/common/util/emailValidation'
import { Input } from '@helpwave/common/components/user-input/Input'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import { LoadingButton } from '@helpwave/common/components/LoadingButton'
import { submitHubSpotForm } from '@/utils/hubspot'
import { SectionBase } from '@/components/sections/SectionBase'

type ContactSectionTranslation = {
  contact: string,
  contactDescription: string,
  firstname: string,
  lastname: string,
  email: string,
  message: string,
  send: string,
  thankYou: string,
  error: string
}

const defaultContactSectionTranslation: Record<Languages, ContactSectionTranslation> = {
  en: {
    contact: 'Contact',
    contactDescription: 'We are available to answer any questions you may have at short notice.',
    firstname: 'First Name',
    lastname: 'Last Name',
    email: 'E-Mail',
    message: 'Your Message',
    send: 'Send Message',
    thankYou: 'Thanks for your message!',
    error: 'There was an error sending the message, try again'
  },
  de: {
    contact: 'Kontakt',
    contactDescription: 'Wir stehen Ihnen bei jeglichen Fragen kurzfristig zur Verfügung.',
    firstname: 'Vorname',
    lastname: 'Nachname',
    email: 'E-Mail',
    message: 'Ihre Nachricht',
    send: 'Nachricht senden',
    thankYou: 'Danke für deine Nachricht!',
    error: 'Ein Fehler ist aufgetreten, versuchen sie es erneut die nachricht zu senden'
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
  message: string,
  hasSend: boolean,
  hasError: boolean
}

const sendContactFormToHubSpot = (form: ContactForm) => submitHubSpotForm(
  '26536657',
  '4709e867-8b69-4e3a-a29f-59a7d5dd7c80',
  [
    {
      objectTypeId: '0-1',
      name: 'email',
      value: form.email
    },
    {
      objectTypeId: '0-1',
      name: 'firstname',
      value: form.firstname
    },
    {
      objectTypeId: '0-1',
      name: 'lastname',
      value: form.lastname
    },
    {
      objectTypeId: '0-1',
      name: 'message',
      value: form.message
    }
  ]
)

const contacts: Contact[] = [
  {
    name: 'Dr. med. Christian Porschen',
    email: 'mediquu@helpwave.de'
  }
]
/**
 * The section on the mediquu page for contacting helpwave
 */
export const ContactSection = ({
  overwriteTranslation,
}: PropsForTranslation<ContactSectionTranslation>) => {
  const translation = useTranslation(defaultContactSectionTranslation, overwriteTranslation)
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstname: '',
    lastname: '',
    email: '',
    message: '',
    hasSend: false,
    hasError: false,
  })
  const [isSending, setIsSending] = useState<boolean>(false)

  const isValid = !!contactForm.firstname && !!contactForm.lastname && validateEmail(contactForm.email) && !!contactForm.message

  return (
    <SectionBase className={tw('flex desktop:flex-row desktop:justify-between mobile:flex-col w-full gap-8')} backgroundColor="gray">
      <div className={tw('flex flex-col gap-y-1 tablet:w-2/5 desktop:w-1/2')}>
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
      <div className={tw('flex flex-col gap-y-2 tablet:w-3/5 desktop:w-1/2')}>
        <Input
          value={contactForm.firstname}
          placeholder={translation.firstname}
          onChange={firstname => setContactForm(prevState => ({ ...prevState, firstname, hasSend: false, hasError: false }))}
        />
        <Input
          value={contactForm.lastname}
          placeholder={translation.lastname}
          onChange={lastname => setContactForm(prevState => ({ ...prevState, lastname, hasSend: false, hasError: false }))}
        />
        <Input
          value={contactForm.email}
          placeholder={translation.email}
          onChange={email => setContactForm(prevState => ({ ...prevState, email, hasSend: false, hasError: false }))}
        />
        <Textarea
          value={contactForm.message}
          placeholder={translation.message}
          onChange={message => setContactForm(prevState => ({ ...prevState, message, hasSend: false, hasError: false }))}
        />
        {contactForm.hasError && (<Span className={tw('text-hw-negative-400 font-semibold my-1')}>{translation.error}</Span>)}
        <LoadingButton
          color="accent-secondary"
          onClick={() => {
            if (!isSending) {
              setIsSending(true)
              sendContactFormToHubSpot(contactForm)
                .then(() => setContactForm({
                  firstname: '',
                  lastname: '',
                  email: '',
                  message: '',
                  hasSend: true,
                  hasError: false
                }))
                .catch((reason) => {
                  setContactForm({
                    ...contactForm,
                    hasSend: false,
                    hasError: true
                  })
                  console.error(reason)
                })
                .finally(() => setIsSending(false))
            }
          }}
          disabled={!isValid}
          className={tw('py-4 w-full')}
          isLoading={isSending}
        >
          {translation.send}
        </LoadingButton>
        {contactForm.hasSend && (<Span className={tw('text-hw-secondary-400 font-bold text-xl text-center')}>{translation.thankYou}</Span>)}
      </div>
    </SectionBase>
  )
}
