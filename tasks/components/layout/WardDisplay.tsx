import { useContext } from 'react'
import { useRouter } from 'next/router'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import { type PropsForTranslation, useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { LoadingAndErrorComponent } from '@helpwave/hightide/components/LoadingAndErrorComponent'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import { ColumnTitle } from '../ColumnTitle'
import { AddCard } from '../cards/AddCard'
import { WardCard } from '../cards/WardCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'

type WardDisplayTranslation = {
  wards: string,
  addWard: string,
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
}

/**
 * The left side of the organizations/[organizationId].tsx page showing the wards within the organizations
 */
export const WardDisplay = ({
  overwriteTranslation,
  organizationId,
  selectedWardId,
}: PropsForTranslation<WardDisplayTranslation, WardDisplayProps>) => {
  const translation = useTranslation(defaultWardDisplayTranslations, overwriteTranslation)
  const router = useRouter()
  const context = useContext(OrganizationOverviewContext)
  const { data, isLoading, isError } = useWardOverviewsQuery(organizationId)

  const wards = data
  selectedWardId ??= context.state.wardId

  return (
    <div className="py-4 px-6">
      <ColumnTitle title={translation.wards}/>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        {wards && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
            {wards.map(ward => (
              <WardCard
                key={ward.id}
                ward={ward}
                // TODO isSelected={selectedWardId === ward.id}
                onEditClick={() => context.updateContext({
                  ...context.state,
                  wardId: ward.id
                })}
                onClick={() => {
                  router.push(`/ward/${ward.id}`).catch(console.error)
                }}
              />
            ))}
            <AddCard
              className="min-h-[76px]"
              text={translation.addWard}
              onClick={() => context.updateContext({
                ...context.state,
                wardId: ''
              })}
              // TODO isSelected={!selectedWardId}
            />
          </div>
        )}
      </LoadingAndErrorComponent>
    </div>
  )
}
