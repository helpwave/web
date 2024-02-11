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

const positionList = ['employee', 'manager', 'investor', 'medical_personal'] as const
export type Position = typeof positionList[number]

type NewsLetterFormTranslation = {
  title: string,
  subtitle: string,
  name: string,
  email: string,
  company: string,
  position: string,
  commit: string,
  positionNames: (position: Position) => string,
  select: string
}

const defaultNewsLetterFormTranslation: Record<Languages, NewsLetterFormTranslation> = {
  en: {
    title: 'Stay Connected',
    subtitle: 'Become part of our vision and never miss updates or releases',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    position: 'Position',
    commit: 'Commit',
    positionNames: (position: Position) => {
      switch (position) {
        case 'medical_personal':
          return 'Medical Personal'
        case 'manager':
          return 'Manager'
        case 'employee':
          return 'Employee'
        case 'investor':
          return 'Investor'
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
    position: 'Position',
    commit: 'Commit',
    positionNames: (position: Position) => {
      switch (position) {
        case 'medical_personal':
          return 'Medizinisches Personal'
        case 'manager':
          return 'Manager'
        case 'employee':
          return 'Arbeitnehmer'
        case 'investor':
          return 'Investor'
      }
    },
    select: 'Auswählen'
  }
}

export type NewsLetterFormType = {
  name: string,
  email: string,
  company: string,
  position?: Position
}

export type NewsLetterFormProps = Partial<NewsLetterFormType> & {
  onSubmit?: (formState: NewsLetterFormType) => void
}

export const NewsLetterForm = ({
  language,
  name = '',
  email = '',
  company = '',
  position,
  onSubmit = noop,
}: PropsWithLanguage<NewsLetterFormTranslation, NewsLetterFormProps>) => {
  const translation = useTranslation(language, defaultNewsLetterFormTranslation)
  const [formState, setFormState] = useState<NewsLetterFormType>({
    name,
    email,
    company,
    position,
  })

  return (
    <div className={tw('rounded-md py-2 px-4 border border-2 w-full border-hw-primary-400')}>
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
            className={tw('!w-3/5')}
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
            className={tw('!w-3/5')}
          />
          <div className={tw('flex flex-row gap-x-4')}>
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
            />
            <Select
              label={translation.position}
              labelClassName="text-sm text-gray-700 font-semibold" // TODO use the relation to <SPAN> type labelSmall
              value={formState.position}
              options={positionList.map(value => ({
                label: translation.positionNames(value),
                value
              }))}
              onChange={position => setFormState(prevState => ({
                ...prevState,
                position
              }))}
              className={tw('!w-full')}
            />
          </div>
          <div className={tw('flex flex-row justify-end mt-4')}>
            <Button onClick={() => onSubmit(formState)} size="large" className={tw('min-w-[120px] w-1/5 max-w-[20%]')}>
              {translation.commit}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
