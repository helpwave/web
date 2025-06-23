import { useContext } from 'react'
import { useRouter } from 'next/router'
import type { Translation } from '@helpwave/hightide'
import { LoadingAndErrorComponent, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import { ColumnTitle } from '../ColumnTitle'
import { AddCard } from '../cards/AddCard'
import { WardCard } from '../cards/WardCard'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'

type WardDisplayTranslation = {
  wards: string,
  addWard: string,
}

const defaultWardDisplayTranslations: Translation<WardDisplayTranslation> = {
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

  console.log(selectedWardId)

  return (
    <div className="py-4 px-6 @container">
      <ColumnTitle title={translation.wards}/>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError}
      >
        <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
          {wards && wards.map(ward => (
            <WardCard
              key={ward.id}
              ward={ward}
              onEditClick={() => context.updateContext({
                ...context.state,
                wardId: ward.id
              })}
              onClick={() => {
                router.push(`/ward/${ward.id}`).catch(console.error)
              }}
              isSelected={selectedWardId === ward.id }
            />
          ))}
          <AddCard
            text={translation.addWard}
            onClick={() => context.updateContext({
              ...context.state,
              wardId: ''
            })}
            isSelected={!selectedWardId}
          />
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
