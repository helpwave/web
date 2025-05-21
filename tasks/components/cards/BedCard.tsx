import clsx from 'clsx'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Plus } from 'lucide-react'
import type { Languages } from '@helpwave/hightide'
import { DragCard, type DragCardProps } from './DragCard'

type BedCardTranslation = {
  nobody: string,
}

const defaultBedCardTranslation: Record<Languages, BedCardTranslation> = {
  en: {
    nobody: 'nobody',
  },
  de: {
    nobody: 'frei',
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
      <DragCard onClick={onClick} isSelected={isSelected}
                className={clsx('min-h-[148px] col', className)} {...restCardProps}>
        <div className="row justify-between">
          <span className="textstyle-title-sm">{bedName}</span>
          <span>{translation.nobody}</span>
        </div>
        <div className="flex-1 justify-center items-center">
          <Plus/>
        </div>
      </DragCard>
    )
  )
}
