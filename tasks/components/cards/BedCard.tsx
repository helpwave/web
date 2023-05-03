import { tw } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Plus } from 'lucide-react'
import { Span } from '@helpwave/common/components/Span'

type BedCardTranslation = {
  nobody: string
}

const defaultBedCardTranslation = {
  de: {
    nobody: 'frei'
  },
  en: {
    nobody: 'nobody'
  }
}

type BedDTO = {
  name: string
}

export type BedCardProps = CardProps & {
  bed: BedDTO
}

/**
 * A Card for showing the Bed for Patient
 *
 * Shown instead of a PatientCard, if there is no patient assigned to the bed
 */
export const BedCard = ({
  language,
  bed,
  onTileClick,
  isSelected
}: PropsWithLanguage<BedCardTranslation, BedCardProps>) => {
  const translation = useTranslation(language, defaultBedCardTranslation)
  return (
    (
      <Card key={bed.name} onTileClick={onTileClick} isSelected={isSelected} className={tw('h-[148px] flex flex-col')}>
        <div className={tw('flex flex-row justify-between')}>
          <Span type="subsubsectionTitle">{bed.name}</Span>
          <Span>{translation.nobody}</Span>
        </div>
        <div className={tw('flex flex-1 justify-center items-center')}>
          <Plus/>
        </div>
      </Card>
    )
  )
}
