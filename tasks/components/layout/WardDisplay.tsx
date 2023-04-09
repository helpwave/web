import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from '../ColumnTitle'
import { AddCard } from '../cards/AddCard'
import { WardCard } from '../cards/WardCard'
import { useRouter } from 'next/router'

type WardDisplayTranslation = {
  wards: string,
  addWard: string
}

const defaultWardDisplayTranslations: Record<Languages, WardDisplayTranslation> = {
  en: {
    wards: 'Wards',
    addWard: 'Add new Ward'
  },
  de: {
    wards: 'Stationen',
    addWard: 'Station hinzufügen'
  }
}

type Room = {
  bedCount: number,
  name: string
}

type WardDTO = {
  id: string,
  name: string,
  rooms: Room[],
  unscheduled: number,
  inProgress: number,
  done: number
}

export type WardDisplayProps = {
  selectedWard: WardDTO | undefined,
  wards: WardDTO[],
  onSelectionChange: (organization: WardDTO | undefined) => void
}

export const WardDisplay = ({
  language,
  selectedWard,
  wards,
  onSelectionChange
}: PropsWithLanguage<WardDisplayTranslation, WardDisplayProps>) => {
  const translation = useTranslation(language, defaultWardDisplayTranslations)
  const router = useRouter()

  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.wards}/>
      <div className={tw('grid grid-cols-2 gap-6')}>
        {wards.map(ward => (
          <WardCard
            key={ward.id}
            ward={ward}
            isSelected={selectedWard?.id === ward.id}
            onEditClick={() => onSelectionChange(ward)}
            onTileClick={async () => await router.push(`/ward/${ward.id}`)}
          />
        ))}
        <AddCard
          className={tw('min-h-[96px]')}
          text={translation.addWard}
          onTileClick={() => onSelectionChange(undefined)}
          isSelected={selectedWard === undefined}
        />
      </div>
    </div>
  )
}
