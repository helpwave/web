import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { LoadingAndErrorComponent, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import { useRecentPatientsQuery } from '@helpwave/api-services/mutations/tasks/patient_mutations'
import { WardCard } from '../cards/WardCard'
import { InvitationBanner } from '../InvitationBanner'
import { PatientCard } from '../cards/PatientCard'
import { AddCard } from '@/components/cards/AddCard'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'

type DashboardDisplayTranslation = {
  patients: string,
  organizations: string,
  wards: string,
  recent: string,
  showAllOrganizations: string,
  addWard: string,
}

const defaultDashboardDisplayTranslations: Translation<DashboardDisplayTranslation> = {
  en: {
    patients: 'Patients',
    organizations: 'Organizations',
    wards: 'Wards',
    recent: 'Recently used',
    showAllOrganizations: 'Show all organizations',
    addWard: 'Add Ward',
  },
  de: {
    patients: 'Patienten',
    organizations: 'Organisationen',
    wards: 'Stationen',
    recent: 'Kürzlich Benutzt',
    showAllOrganizations: 'Alle Organisationen anzeigen',
    addWard: 'Station hinzufügen',
  }
}

export type DashboardDisplayProps = Record<string, unknown>

/**
 * The left side of the DashboardPage
 */
export const DashboardDisplay = ({
                                   overwriteTranslation,
                                 }: PropsForTranslation<DashboardDisplayTranslation, DashboardDisplayProps>) => {
  const translation = useTranslation(defaultDashboardDisplayTranslations, overwriteTranslation)
  const { organization } = useAuth()
  const router = useRouter()

  // TODO replace with recent wards later
  const {
    data: wards,
    isLoading: isLoadingWards
  } = useWardOverviewsQuery()
  const {
    data: patients,
    isLoading: isLoadingPatients
  } = useRecentPatientsQuery()

  return (
    <div className="col py-4 px-6 gap-y-4 @container">
      <InvitationBanner/>
      <span className="textstyle-title-md">{translation.recent}</span>
      <LoadingAndErrorComponent
        isLoading={isLoadingPatients}
      >
        {patients && patients.length > 0 && (
          <>
            <span className="textstyle-title-normal">{translation.patients}</span>
            <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
              {patients?.map(patient => (
                <PatientCard
                  key={patient.id}
                  className={clsx({ '!cursor-not-allowed': !patient.wardId })}
                  bedName={patient.bed?.name}
                  patientName={patient.name}
                  onClick={() => patient.wardId ? router.push(`/ward/${patient.wardId}`) : undefined}
                />
              ))}
            </div>
          </>
        )}
      </LoadingAndErrorComponent>
      <LoadingAndErrorComponent isLoading={isLoadingWards}>
        <div className="col gap-y-1">
          <span className="textstyle-title-normal">{translation.wards}</span>
          <div className="grid @max-md:grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6">
            {wards && wards.length > 0 && wards?.map(ward => (
              <WardCard
                key={ward.id}
                ward={ward}
                onClick={() => router.push(`/ward/${ward.id}`)}
              />
            ))}
            <AddCard
              text={translation.addWard}
              onClick={() => router.push(`/organizations/${organization?.id}`)}
            />
          </div>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
