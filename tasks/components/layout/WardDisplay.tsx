import { useContext } from 'react'
import { useRouter } from 'next/router'
import { tw } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ColumnTitle } from '../ColumnTitle'
import { AddCard } from '../cards/AddCard'
import { WardCard } from '../cards/WardCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'
import { useWardOverviewsQuery } from '@/mutations/ward_mutations'

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
  organizationId: string,
  selectedWardId?: string,
  width?: number
}

/**
 * The left side of the organizations/[id].tsx page showing the wards within the organizations
 */
export const WardDisplay = ({
  language,
  organizationId,
  selectedWardId,
  width
}: PropsWithLanguage<WardDisplayTranslation, WardDisplayProps>) => {
  const translation = useTranslation(language, defaultWardDisplayTranslations)
  const router = useRouter()
  const context = useContext(OrganizationOverviewContext)
  const { data, isLoading, isError } = useWardOverviewsQuery(organizationId)

  const wards = data
  selectedWardId ??= context.state.wardId
  const columns = width === undefined ? 3 : Math.max(Math.floor(width / 250), 1)

  return (
    <div className={tw('py-4 px-6')}>
      <ColumnTitle title={translation.wards}/>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {wards && (
          <div className={tw(`grid grid-cols-${columns} gap-6`)}>
            {wards.map(ward => (
              <WardCard
                key={ward.id}
                ward={ward}
                isSelected={selectedWardId === ward.id}
                onEditClick={() => context.updateContext({
                  ...context.state,
                  wardId: ward.id
                })}
                onTileClick={async () => await router.push(`/ward/${ward.id}`)}
              />
            ))}
            <AddCard
              className={tw('min-h-[76px]')}
              text={translation.addWard}
              onTileClick={() => context.updateContext({
                ...context.state,
                wardId: ''
              })}
              isSelected={!selectedWardId}
            />
          </div>
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
