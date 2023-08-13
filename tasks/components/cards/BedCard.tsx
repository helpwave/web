import { tw, tx } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Plus } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'
import type { Languages } from '@helpwave/common/hooks/useLanguage'

type BedCardTranslation = {
  nobody: string
}

const defaultBedCardTranslation: Record<Languages, BedCardTranslation> = {
  en: {
    nobody: 'nobody',
  },
  de: {
    nobody: 'frei',
  }
}

export type BedCardProps = CardProps & {
  bedName: string
}

/**
 * A Card for showing the Bed for Patient
 *
 * Shown instead of a PatientCard, if there is no patient assigned to the bed
 */
export const BedCard = ({
  language,
  bedName,
  onTileClick,
  isSelected,
  className,
  ...restCardProps
}: PropsWithLanguage<BedCardTranslation, BedCardProps>) => {
  const translation = useTranslation(language, defaultBedCardTranslation)
  return (
    (
      <Card onTileClick={onTileClick} isSelected={isSelected} className={tx('min-h-[148px] flex flex-col', className)} {...restCardProps}>
        <div className={tw('flex flex-row justify-between')}>
          <Span type="subsubsectionTitle">{bedName}</Span>
          <Span>{translation.nobody}</Span>
        </div>
        <div className={tw('flex flex-1 justify-center items-center')}>
          <Plus/>
        </div>
      </Card>
    )
  )
}
