import { forwardRef, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { tw } from '@helpwave/common/twind'
import { TitleSection } from '../Section'
import { Input } from '../Input'
import { Toast } from '../Toast'
import Send from '../../icons/Send'
import AlertCircle from '../../icons/AlertCircle'
import { hubspotSubmitForm } from '../../utils/hubspot'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type ContactSectionLanguage = {
  heading: string,
  yourInformation: string,
  email: string,
  firstName: string,
  lastName: string,
  message: string,
  send: string,
  successMessage: string,
  failureMessage: string,
  MoreTitle: string,
  MoreText: string,
  MoreTextForCTA: string
}

const defaultContactSectionTranslations: Record<Languages, ContactSectionLanguage> = {
  en: {
    heading: 'Contact',
    yourInformation: 'Your Information',
    email: 'Email',
    firstName: 'First name',
    lastName: 'Last name',
    message: 'Message',
    send: 'Send',
    successMessage: 'Message sent!',
    failureMessage: 'Something went wrong!',
    MoreTitle: 'U want more?',
    MoreText: 'You can already become part of the helpwave family and join us on our way to an innovative healthcare system.',
    MoreTextForCTA: 'Simply register for it right here!'
  },
  de: {
    heading: 'Kontakt',
    yourInformation: 'DE: Your Information', // TODO: translate (in a nice sounding way; not "Ihre/Deine Informationen")
    email: 'Email',
    firstName: 'Vorname',
    lastName: 'Nachname',
    message: 'Nachricht',
    send: 'Abschicken',
    successMessage: 'Nachricht gesendet!',
    failureMessage: 'Es ist ein Fehler aufgetreten!',
    MoreTitle: 'U want more?',
    MoreText: 'Du kannst schon heute Teil der helpwave-Familie werden und uns auf unserem Weg zu einem innovativen Gesundheitswesen begleiten.',
    MoreTextForCTA: 'Melde dich dafür einfach direkt hier an!'
  }
}

const ContactSection = forwardRef<HTMLDivElement, PropsWithLanguage<ContactSectionLanguage, Record<string, unknown>>>(function ContactSection(props, ref) {
  const language = useTranslation(props.language, defaultContactSectionTranslations)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: this ain't it chief, validate the values more properly
    if (email !== '' && firstName !== '' && lastName !== '' && message !== '') {
      hubspotSubmitForm({
        email,
        firstName,
        lastName,
        message,
      })
        .then((json) => { // TODO: this may still be an errornous response, check the actual response for errors
          setEmail('')
          setFirstName('')
          setLastName('')
          setMessage('')

          toast.custom(<Toast message={language.successMessage} theme="dark" variant="primary" icon={<Send width={20} height={24} />} />, { position: 'bottom-left', duration: 1000 })
        })
        .catch((error) => {
          console.error(error)
          toast.custom(<Toast message={language.failureMessage} theme="dark" variant="negative" icon={<AlertCircle />} />, { position: 'bottom-left', duration: 5000 })
        })
    }
  }

  return (
    <TitleSection id="contact" ref={ref} title={language.heading}>
      <div className={tw('flex space-x-16')}>
        <div>
          <form onSubmit={handleSubmit}>
            <span className={tw('block font-medium text-white')}>Your Information</span>

            <div className={tw('flex w-96')}>
              <Input id="contact-us-email" group={['bottom']} label={language.email} placeholder={language.email} type="email" value={email} onChange={setEmail} />
            </div>
            <div className={tw('flex w-96')}>
              <Input id="contact-us-first-name" group={['top', 'right']} label={language.firstName} placeholder={language.firstName} type="text" value={firstName} onChange={setFirstName} />
              <Input id="contact-us-last-name" group={['top', 'left']} label={language.lastName} placeholder={language.lastName} type="text" value={lastName} onChange={setLastName} />
            </div>

            <br />

            <span className={tw('block font-medium text-white')}>{language.message}</span>
            <div className={tw('flex w-96')}>
              <textarea className={tw('mt-1 block w-full h-48 bg-hw-dark-gray-800 placeholder:text-[#8E8E93] border-2 border-hw-primary-700 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500')} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <button type="submit" className={tw('mt-2 py-1 px-4 flex border-2 border-hw-primary-700 rounded-md space-x-2')}>
              <span>{language.send}</span>
              <Send width={20} height={24} />
            </button>
          </form>
        </div>
        <div className={tw('w-64')}>
          <h2 className={tw('font-space font-bold text-3xl pt-5 pb-3')}>{language.MoreTitle}</h2>
          <span className={tw('block')}>{language.MoreText}</span>
          <span className={tw('text-hw-primary-400 text-xl inline-block mt-5')}>{language.MoreTextForCTA}</span>
        </div>
      </div>
    </TitleSection>
  )
})

export default ContactSection
