import type { Languages } from '@helpwave/hightide'
import type { PropsForTranslation } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import { useState } from 'react'
import { Select } from '@helpwave/hightide'
import { LoadingButton } from '@helpwave/hightide'

const industryList = ['investment', 'hospital', 'patient_care', 'research', 'development', 'press'] as const
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
  thankYou: string,
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
        case 'press':
          return 'Press'
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
        case 'press':
          return 'Presse'
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
  industry?: Industry,
}

export type NewsLetterFormProps = Partial<NewsLetterFormType> & {
  onSubmit?: (formState: NewsLetterFormType) => Promise<void>,
}

export const NewsLetterForm = ({
  overwriteTranslation,
  firstname = '',
  lastname = '',
  email = '',
  company = '',
  industry,
  onSubmit = () => Promise.resolve(),
}: PropsForTranslation<NewsLetterFormTranslation, NewsLetterFormProps>) => {
  const translation = useTranslation(defaultNewsLetterFormTranslation, overwriteTranslation)
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
    <div className="rounded-lg py-2 px-4 w-full bg-[#FFFFFFEE] border border-2">
      <div className="col">
        <span className="textstyle-title-md">{translation.title}</span>
        <span className="textstyle-form-description">{translation.subtitle}</span>
        <div className="col my-2 gap-y-1">
        <form>
          <Input
            id="email"
            value={formState.email}
            label={{ name: `${translation.email}*` }}
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
            className="!desktop:w-3/5 !max-w-[300px]"
          />
          <div className="desktop:flex-row max-tablet:col gap-x-4">
            <Input
              id="firstname"
              value={formState.firstname}
              label={{ name: translation.firstname }}
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
              label={{ name: `${translation.lastname}*` }}
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
          <div className="desktop:flex-row max-tablet:col gap-x-4">
            <Input
              id="company"
              value={formState.company}
              label={{ name: translation.company }}
              onChange={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              onEditCompleted={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              maxLength={255}
              className="!max-w-[300px]"
            />
            <Select
              label={{ name: translation.industry, labelType: 'labelSmall' }}
              value={formState.industry}
              options={industryList.map(value => ({
                label: translation.industryNames(value),
                value
              }))}
              onChange={industry => setFormState(prevState => ({
                ...prevState,
                industry
              }))}
              className="!w-full !max-w-[300px] bg-white"
            />
          </div>
          <div className="row justify-end mt-4">
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
                }} size="medium" className="min-w-[120px] w-fit">
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
