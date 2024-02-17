import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user-input/Input'
import { useState } from 'react'
import { Select } from '@helpwave/common/components/user-input/Select'
import { LoadingButton } from '@helpwave/common/components/LoadingButton'

const industryList = ['investment', 'hospital', 'patient_care', 'research', 'development'] as const
export type Industry = typeof industryList[number]

type NewsLetterFormTranslation = {
  title: string,
  subtitle: string,
  firstname: string,
  lastname: string,
  email: string,
  company: string,
  industry: string,
  callToAction: string,
  industryNames: (industry: Industry) => string,
  select: string,
  thankYou: string
}

const defaultNewsLetterFormTranslation: Record<Languages, NewsLetterFormTranslation> = {
  en: {
    title: 'Stay Connected',
    subtitle: 'Become part of our vision and never miss updates or releases',
    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'Email',
    company: 'Company',
    industry: 'Industry',
    callToAction: 'Stay In the Loop',
    industryNames: (industry: Industry) => {
      switch (industry) {
        case 'investment':
          return 'Investment'
        case 'hospital':
          return 'Hospital'
        case 'patient_care':
          return 'Patient Care'
        case 'research':
          return 'Research'
        case 'development':
          return 'Development'
      }
    },
    select: 'Select',
    thankYou: 'Thank you. We will keep you up to date!'
  },
  de: {
    title: 'Bleib Informiert',
    subtitle: 'Werde Teil unserer Vision and verpasse keine Updates oder Veröffentlichungen',
    firstname: 'Vorname',
    lastname: 'Nachname',
    email: 'Email',
    company: 'Firma',
    industry: 'Industry',
    callToAction: 'Bleib informiert',
    industryNames: (industry: Industry) => {
      switch (industry) {
        case 'investment':
          return 'Investment'
        case 'hospital':
          return 'Krankenhaus'
        case 'patient_care':
          return 'Patientenversorgung'
        case 'research':
          return 'Wissenschaft'
        case 'development':
          return 'Entwicklung'
      }
    },
    select: 'Auswählen',
    thankYou: 'Danke. Wir werden dich auf dem Laufenden halten!'
  }
}

export type NewsLetterFormType = {
  firstname: string,
  lastname: string,
  email: string,
  company: string,
  industry?: Industry
}

export type NewsLetterFormProps = Partial<NewsLetterFormType> & {
  onSubmit?: (formState: NewsLetterFormType) => Promise<void>
}

export const NewsLetterForm = ({
  language,
  firstname = '',
  lastname = '',
  email = '',
  company = '',
  industry,
  onSubmit = () => Promise.resolve(),
}: PropsWithLanguage<NewsLetterFormTranslation, NewsLetterFormProps>) => {
  const translation = useTranslation(language, defaultNewsLetterFormTranslation)
  const [isLoading, setLoading] = useState(false)
  const [showThankYouMessage, setShowThankYouMessage] = useState(false)
  const [formState, setFormState] = useState<NewsLetterFormType>({
    firstname,
    lastname,
    email,
    company,
    industry,
  })

  return (
    <div className={tw('rounded-md py-2 px-4 w-full')}>
      <div className={tw('flex flex-col')}>
        <Span type="title">{translation.title}</Span>
        <Span type="formDescription">{translation.subtitle}</Span>
        <div className={tw('flex flex-col my-2 gap-y-1')}>
        <form>
          <Input
            id="email"
            value={formState.email}
            label={`${translation.email}*`}
            onChange={text => setFormState(prevState => ({
              ...prevState,
              email: text
            }))}
            onEditCompleted={text => setFormState(prevState => ({
              ...prevState,
              email: text
            }))}
            maxLength={255}
            required={true}
          />
          <div className={tw('flex flex-row gap-x-4')}>
            <Input
              id="firstname"
              value={formState.firstname}
              label={translation.firstname}
              onChange={text => setFormState(prevState => ({
                ...prevState,
                firstname: text
              }))}
              onEditCompleted={text => setFormState(prevState => ({
                ...prevState,
                firstname: text
              }))}
              maxLength={255}
            />
            <Input
              id="lastname"
              value={formState.lastname}
              label={`${translation.lastname}*`}
              onChange={text => setFormState(prevState => ({
                ...prevState,
                lastname: text
              }))}
              onEditCompleted={text => setFormState(prevState => ({
                ...prevState,
                lastname: text
              }))}
              maxLength={255}
              required={true}
            />
          </div>
          <div className={tw('flex flex-row gap-x-4')}>
            <Input
              id="company"
              value={formState.company}
              label={translation.company}
              onChange={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              onEditCompleted={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              maxLength={255}
            />
            <Select
              label={translation.industry}
              labelClassName="text-sm text-gray-700 font-semibold" // TODO use the relation to <SPAN> type labelSmall
              value={formState.industry}
              options={industryList.map(value => ({
                label: translation.industryNames(value),
                value
              }))}
              onChange={industry => setFormState(prevState => ({
                ...prevState,
                industry
              }))}
              className={tw('!w-full')}
            />
          </div>
          <div className={tw('flex flex-row justify-end mt-4')}>
            {
              showThankYouMessage ? (
                <p>{translation.thankYou}</p>
              ) : (
                <LoadingButton type="submit" isLoading={isLoading} onClick={() => {
                  if (!formState.email || !formState.lastname) return

                  setLoading(true)
                  onSubmit(formState).finally(() => {
                    setLoading(false)
                    setShowThankYouMessage(true)
                  })
                }} size="medium" className={tw('min-w-[120px] w-fit')}>
                  {translation.callToAction}
                </LoadingButton>
              )
            }
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
