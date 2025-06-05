import clsx from 'clsx'
import type { Languages } from '@helpwave/hightide'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { Plus } from 'lucide-react'
import { DragCard, type DragCardProps } from './DragCard'

type BedCardTranslation = {
  nobody: string,
  addPatient: string,
}

const defaultBedCardTranslation: Record<Languages, BedCardTranslation> = {
  en: {
    nobody: 'nobody',
    addPatient: 'Add Patient'
  },
  de: {
    nobody: 'frei',
    addPatient: 'Patient hinzufügen',
  }
}

export type BedCardProps = DragCardProps & {
  bedName: string,
}

/**
 * A Card for showing the Bed for Patient
 *
 * Shown instead of a PatientCard, if there is no patient assigned to the bed
 */
export const BedCard = ({
                          overwriteTranslation,
                          bedName,
                          onClick,
                          isSelected,
                          className,
                          ...restCardProps
                        }: PropsForTranslation<BedCardTranslation, BedCardProps>) => {
  const translation = useTranslation(defaultBedCardTranslation, overwriteTranslation)
  return (
    (
      <DragCard
        onClick={onClick}
        isSelected={isSelected}
        className={clsx('min-h-40 col', className)}
        {...restCardProps}
      >
        <div className="row justify-between">
          <span className="textstyle-title-sm">{bedName}</span>
          <span>{translation.nobody}</span>
        </div>
        <div className="col grow justify-center items-center">
          <div className="row text-description">
            <Plus/>
            {translation.addPatient}
          </div>
        </div>
      </DragCard>
    )
  )
}
