import { tw, tx } from '@helpwave/style-themes/twind'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Plus } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
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
  onTileClick,
  isSelected,
  className,
  ...restCardProps
}: PropsForTranslation<BedCardTranslation, BedCardProps>) => {
  const translation = useTranslation(defaultBedCardTranslation, overwriteTranslation)
  return (
    (
      <DragCard onTileClick={onTileClick} isSelected={isSelected} className={tx('min-h-[148px] flex flex-col', className)} {...restCardProps}>
        <div className={tw('flex flex-row justify-between')}>
          <span className={tw('textstyle-title-sm')}>{bedName}</span>
          <span>{translation.nobody}</span>
        </div>
        <div className={tw('flex flex-1 justify-center items-center')}>
          <Plus/>
        </div>
      </DragCard>
    )
  )
}
