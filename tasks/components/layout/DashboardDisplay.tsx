import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useWardOverviewsQuery } from '../../mutations/ward_mutations'
import { Button } from '@helpwave/common/components/Button'
import { OrganizationCard } from '../cards/OrganizationCard'
import { WardCard } from '../cards/WardCard'
import { useRouter } from 'next/router'
import { Span } from '@helpwave/common/components/Span'
import type { OrganizationDTO } from '../../mutations/organization_mutations'
import { InvitationBanner } from '../InvitationBanner'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useAuth } from '../../hooks/useAuth'
import { getConfig } from '../../utils/config'
import { useRecentPatientsQuery } from '../../mutations/patient_mutations'
import { PatientCard } from '../cards/PatientCard'

type DashboardDisplayTranslation = {
  patients: string,
  organizations: string,
  wards: string,
  recent: string,
  showAllOrganizations: string
}

const defaultDashboardDisplayTranslations: Record<Languages, DashboardDisplayTranslation> = {
  en: {
    patients: 'Patients',
    organizations: 'Organizations',
    wards: 'Wards',
    recent: 'Recently used',
    showAllOrganizations: 'Show all organizations'
  },
  de: {
    patients: 'Patienten',
    organizations: 'Organisationen',
    wards: 'Stationen',
    recent: 'Kürzlich Benutzt',
    showAllOrganizations: 'Alle Organisationen anzeigen'
  }
}

export type DashboardDisplayProps = {
  organizations: OrganizationDTO[],
  width?: number
}

/**
 * The left side of the DashboardPage
 */
export const DashboardDisplay = ({
  language,
  organizations,
  width
}: PropsWithLanguage<DashboardDisplayTranslation, DashboardDisplayProps>) => {
  const translation = useTranslation(language, defaultDashboardDisplayTranslations)
  const router = useRouter()
  const minimumWidthOfCards = 220 // the value of much space a card and the surrounding gap requires, given in px
  const columns = !width ? 3 : Math.max(Math.floor(width / minimumWidthOfCards), 1)
  const { organizations: tokenOrganizations } = useAuth()
  const {
    data: wards,
    isLoading: isLoadingWards
  } = useWardOverviewsQuery(organizations.length > 0 ? organizations[0].id : undefined)
  const { fakeTokenEnable } = getConfig()
  const {
    data: patients,
    isLoading: isLoadingPatients
  } = useRecentPatientsQuery()
  organizations = organizations.filter((organization) => fakeTokenEnable || tokenOrganizations.includes(organization.id))

  return (
    <div className={tw('flex flex-col py-4 px-6 gap-y-4')}>
      <InvitationBanner/>
      <Span type="title">{translation.recent}</Span>
      <LoadingAndErrorComponent
        isLoading={isLoadingPatients}
      >
        <Span type="subsectionTitle">{translation.patients}</Span>
        {patients?.map(patient => (
          <PatientCard
            key={patient.id}
            className={tx({ '!cursor-not-allowed': !patient.wardId })}
            bedName={patient.bed?.name}
            patientName={patient.name}
            onTileClick={() => patient.wardId ? router.push(`/ward/${patient.wardId}`) : undefined}
          />
        ))}
      </LoadingAndErrorComponent>
      {organizations.length > 0 && (
        <LoadingAndErrorComponent isLoading={isLoadingWards}>
          <div className={tw('flex flex-col gap-y-1')}>
            <Span type="subsectionTitle">{translation.wards}</Span>
            {wards && wards.length > 0 ? (
              <div className={tw(`grid grid-cols-${columns} gap-6`)}>
                {wards?.map(ward => (
                  <WardCard
                    key={ward.id}
                    ward={ward}
                    onTileClick={() => router.push(`/ward/${ward.id}`)}
                  />
                ))}
              </div>
            ) : <Span type="accent">No wards</Span>}
          </div>
        </LoadingAndErrorComponent>
      )}
      {organizations && (
        <div>
          <div className={tw('flex flex-row gap-x-2 justify-between mb-4')}>
            <Span type="subsectionTitle">{translation.organizations}</Span>
            <div>
              <Button
                color="accent"
                onClick={() => router.push('/organizations')}
              >
                {translation.showAllOrganizations}
              </Button>
            </div>
          </div>
          <div className={tw(`grid grid-cols-${columns} gap-6`)}>
            {organizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                onTileClick={() => router.push(`/organizations/${organization.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
