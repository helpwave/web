import { tw } from '@helpwave/common/twind'
import Add from '@helpwave/common/icons/Add'
import { Card } from './Card'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

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

export type BedCardProps = {
  bed: BedDTO,
  onClick?: () => undefined
}

export const BedCard = ({
  language,
  bed,
  onClick
}: PropsWithLanguage<BedCardTranslation, BedCardProps>) => {
  const translation = useTranslation(language, defaultBedCardTranslation)
  return (
    (
      <Card key={bed.name} onTileClick={onClick}>
        <div className={tw('flex flex-row justify-between')}>
          <span className={tw('font-space font-bold')}>{bed.name}</span>
          <span>{translation.nobody}</span>
        </div>
        <div className={tw('flex h-full justify-center items-center')}>
          <Add/>
        </div>
      </Card>
    )
  )
}
