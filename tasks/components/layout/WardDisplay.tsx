import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { ColumnTitle } from '../ColumnTitle'
import { AddCard } from '../cards/AddCard'
import { WardCard } from '../cards/WardCard'
import { useRouter } from 'next/router'
import type { WardDetailDTO, WardOverviewDTO } from '../../mutations/ward_mutations'

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

export type WardDisplayProps = {
  selectedWard?: WardDetailDTO,
  wards: WardOverviewDTO[],
  onSelectionChange: (ward: WardOverviewDTO | undefined) => void,
  width?: number
}

/**
 * The left side of the organizations/[uuid].tsx page showing the wards within the organizations
 */
export const WardDisplay = ({
  language,
  selectedWard,
  wards,
  onSelectionChange,
  width
}: PropsWithLanguage<WardDisplayTranslation, WardDisplayProps>) => {
  const translation = useTranslation(language, defaultWardDisplayTranslations)
  const router = useRouter()
  const columns = width === undefined ? 3 : Math.max(Math.floor(width / 250), 1)
  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.wards}/>
      <div className={tw(`grid grid-cols-${columns} gap-6`)}>
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
          className={tw('min-h-[76px]')}
          text={translation.addWard}
          onTileClick={() => onSelectionChange(undefined)}
          isSelected={selectedWard?.id === ''}
        />
      </div>
    </div>
  )
}
