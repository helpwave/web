import { tw } from '@helpwave/common/twind'
import { Span } from '@helpwave/common/components/Span'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import type { Gender } from '@helpwave/api-services/types/tasks/patient'
import { Check, TriangleAlert } from 'lucide-react'
import type { AppColor } from '@helpwave/common/twind/config'
import { tx } from '@twind/core'
import { Card } from '@helpwave/common/components/Card'
import type { DragCardProps } from '@/components/cards/DragCard'

type PatientCardTranslation = {
  bedNotAssigned: string,
  years: string,
  openTasks: (amount: number) => string
} & Record<Gender, string>

const defaultPatientCardTranslations: Record<Languages, PatientCardTranslation> = {
  en: {
    bedNotAssigned: 'Not Assigned',
    years: 'yrs',
    male: 'M',
    female: 'F',
    diverse: 'D',
    openTasks: amount => amount === 1 ? `${amount} Open Task` : `${amount} Open Tasks`
  },
  de: {
    bedNotAssigned: 'Nicht Zugewiesen',
    years: 'jr',
    male: 'M',
    female: 'F',
    diverse: 'D',
    openTasks: amount => amount === 1 ? `${amount} Offener Task` : `${amount} Offene Tasks`
  }
}

export type PatientCardProps = DragCardProps & {
  bedName?: string,
  patientName: string,
  openTasks?: number,
  gender?: Gender,
  age?: number,
  hasWarning?: boolean
}

/**
 * A Card for displaying a Patient and the tasks
 */
export const PatientCard = ({
  overwriteTranslation,
  bedName,
  patientName,
  openTasks = 0,
  gender = 'diverse', // TODO change to required when patient has this property
  hasWarning = false,
  age = 32, // TODO change to required when patient has this property
  isSelected,
  className,
  ...restCardProps
}: PropsForTranslation<PatientCardTranslation, PatientCardProps>) => {
  const translation = useTranslation(defaultPatientCardTranslations, overwriteTranslation)
  const genderColorMapping: Record<Gender, AppColor> = {
    male: 'hw-male',
    female: 'hw-female',
    diverse: 'hw-diverse',
  }

  const usedColor = genderColorMapping[gender]

  return (
    <Card isSelected={isSelected} {...restCardProps} className={tx(`flex flex-col !border-${usedColor}-200 hover:!border-${usedColor}-400 !bg-${usedColor}-50 gap-y-1 py-3`, className)} >
      <div className={tw('flex flex-row justify-between gap-x-2 items-center')}>
        <Span type="description" className={tw('font-semibold')}>{bedName ?? translation.bedNotAssigned}</Span>
        {hasWarning && <TriangleAlert className={tw('text-hw-warn-400')} />}
      </div>
      <div className={tw('flex flex-row justify-between gap-x-2 items-center')}>
        <Span className={tw('truncate font-bold text-lg')}>{patientName}</Span>
        <Span type="description">{translation[gender]},<Span type="description" className="font-semibold">{age}</Span>{`${translation.years}`}</Span>
      </div>
      <div className={tx(`flex flex-row gap-x-2 text-${usedColor}-400 items-center`, { 'opacity-40': openTasks === 0 })}>
        <div className={tw(`p-[2px] rounded-full bg-${usedColor}-100`)}>
          <Check size={16} strokeWidth={2}/>
        </div>
        <Span className={tw('font-semibold')}>{translation.openTasks(openTasks)}</Span>
      </div>
    </Card>
  )
}
