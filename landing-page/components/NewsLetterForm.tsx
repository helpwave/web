import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user-input/Input'
import { noop } from '@helpwave/common/util/noop'
import { useState } from 'react'
import { Select } from '@helpwave/common/components/user-input/Select'
import { Button } from '@helpwave/common/components/Button'

const industryList = ['investment', 'hospital', 'patient_care', 'research', 'development', 'press'] as const
export type Industry = typeof industryList[number]

type NewsLetterFormTranslation = {
  title: string,
  subtitle: string,
  name: string,
  email: string,
  company: string,
  industry: string,
  callToAction: string,
  industryNames: (instdustry: Industry) => string,
  select: string
}

const defaultNewsLetterFormTranslation: Record<Languages, NewsLetterFormTranslation> = {
  en: {
    title: 'Stay Connected',
    subtitle: 'Become part of our vision and never miss updates or releases',
    name: 'Name',
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
    select: 'Select'
  },
  de: {
    title: 'Bleib Informiert',
    subtitle: 'Werde Teil unserer Vision and verpasse keine Updates oder Veröffentlichungen',
    name: 'Name',
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
    select: 'Auswählen'
  }
}

export type NewsLetterFormType = {
  name: string,
  email: string,
  company: string,
  industry?: Industry
}

export type NewsLetterFormProps = Partial<NewsLetterFormType> & {
  onSubmit?: (formState: NewsLetterFormType) => void
}

export const NewsLetterForm = ({
  language,
  name = '',
  email = '',
  company = '',
  industry,
  onSubmit = noop,
}: PropsWithLanguage<NewsLetterFormTranslation, NewsLetterFormProps>) => {
  const translation = useTranslation(language, defaultNewsLetterFormTranslation)
  const [formState, setFormState] = useState<NewsLetterFormType>({
    name,
    email,
    company,
    industry,
  })

  return (
    <div className={tw('rounded-lg py-2 px-4 w-full bg-[#FFFFFFEE] border border-2')}>
      <div className={tw('flex flex-col')}>
        <Span type="title">{translation.title}</Span>
        <Span type="formDescription">{translation.subtitle}</Span>
        <Span></Span>
        <div className={tw('flex flex-col my-2 gap-y-1')}>
          <Input
            id="name"
            value={formState.name}
            label={translation.name}
            onBlur={() => undefined} // TODO handle later
            onChange={text => setFormState(prevState => ({
              ...prevState,
              name: text
            }))}
            onEditCompleted={text => setFormState(prevState => ({
              ...prevState,
              name: text
            }))}
            maxLength={255}
            className={tw('!desktop:w-3/5 !max-w-[300px]')}
          />
          <Input
            id="email"
            value={formState.email}
            label={translation.email}
            onBlur={() => undefined} // TODO handle later
            onChange={text => setFormState(prevState => ({
              ...prevState,
              email: text
            }))}
            onEditCompleted={text => setFormState(prevState => ({
              ...prevState,
              email: text
            }))}
            maxLength={255}
            className={tw('!desktop:w-3/5 !max-w-[300px]')}
          />
          <div className={tw('flex desktop:flex-row desktop:gap-x-4 mobile:flex-col mobile:gap-y-2')}>
            <Input
              id="company"
              value={formState.company}
              label={translation.company}
              onBlur={() => undefined} // TODO handle later
              onChange={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              onEditCompleted={text => setFormState(prevState => ({
                ...prevState,
                company: text
              }))}
              maxLength={255}
              className={tw('!max-w-[300px]')}
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
              className={tw('!w-full !max-w-[300px]')}
            />
          </div>
          <div className={tw('flex flex-row justify-end mt-4')}>
            <Button onClick={() => onSubmit(formState)} size="medium" className={tw('min-w-[120px] w-fit')}>
              {translation.callToAction}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
