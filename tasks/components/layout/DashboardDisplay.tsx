import clsx from 'clsx'
import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import { useRecentPatientsQuery } from '@helpwave/api-services/mutations/tasks/patient_mutations'
import { WardCard } from '../cards/WardCard'
import { InvitationBanner } from '../InvitationBanner'
import { PatientCard } from '../cards/PatientCard'

type DashboardDisplayTranslation = {
  patients: string,
  organizations: string,
  wards: string,
  recent: string,
  showAllOrganizations: string,
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
  width?: number,
}

/**
 * The left side of the DashboardPage
 */
export const DashboardDisplay = ({
  overwriteTranslation,
  width
}: PropsForTranslation<DashboardDisplayTranslation, DashboardDisplayProps>) => {
  const translation = useTranslation(defaultDashboardDisplayTranslations, overwriteTranslation)
  const router = useRouter()
  const minimumWidthOfCards = 220 // the value of much space a card and the surrounding gap requires, given in px
  const columns = !width ? 3 : Math.max(Math.floor(width / minimumWidthOfCards), 1)
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
    <div className="col py-4 px-6 gap-y-4">
      <InvitationBanner/>
      <span className="textstyle-title-md">{translation.recent}</span>
      <LoadingAndErrorComponent
        isLoading={isLoadingPatients}
      >
        {patients && patients.length > 0 && (
          <>
            <span className="textstyle-title-normal">{translation.patients}</span>
            <div className={`grid grid-cols-${columns} gap-6`}>
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
          {wards && wards.length > 0 && (
            <>
              <span className="textstyle-title-normal">{translation.wards}</span>
              <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
                {wards?.map(ward => (
                  <WardCard
                    key={ward.id}
                    ward={ward}
                    onClick={() => router.push(`/ward/${ward.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
