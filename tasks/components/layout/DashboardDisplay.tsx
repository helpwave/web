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
import { ColumnTitle } from '@/components/ColumnTitle'
import { useMyTasksQuery } from '@helpwave/api-services/mutations/tasks/task_mutations'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { TaskCard } from '@/components/cards/TaskCard'
import { useMemo, useState } from 'react'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import { TaskStatusUtil } from '@helpwave/api-services/types/tasks/task'
import { TaskDetailModal } from '@/components/modals/TaskDetailModal'

type DashboardDisplayTranslation = {
  patients: string,
  organizations: string,
  wards: string,
  recent: string,
  showAllOrganizations: string,
  addWard: string,
  myTasks: string,
  noTasks: string,
}

const defaultDashboardDisplayTranslations: Translation<DashboardDisplayTranslation> = {
  en: {
    patients: 'Patients',
    organizations: 'Organizations',
    wards: 'Wards',
    recent: 'Recently used',
    showAllOrganizations: 'Show all organizations',
    addWard: 'Add Ward',
    myTasks: 'My Tasks',
    noTasks: 'No tasks'
  },
  de: {
    patients: 'Patienten',
    organizations: 'Organisationen',
    wards: 'Stationen',
    recent: 'Kürzlich Benutzt',
    showAllOrganizations: 'Alle Organisationen anzeigen',
    addWard: 'Station hinzufügen',
    myTasks: 'Meine Aufgaben',
    noTasks: 'Keine Aufgaben',
  }
}

export type DashboardDisplayProps = Record<string, unknown>

/**
 * The left side of the DashboardPage
 */
export const DashboardDisplay = ({
                                   overwriteTranslation,
                                 }: PropsForTranslation<DashboardDisplayTranslation, DashboardDisplayProps>) => {
  const translation = useTranslation([defaultDashboardDisplayTranslations], overwriteTranslation)
  const { organization } = useAuth()
  const router = useRouter()
  const [taskDetailModalId, setTaskDetailModalId] = useState<string>()

  // TODO replace with recent wards later
  const {
    data: wards,
    isLoading: isLoadingWards
  } = useWardOverviewsQuery()
  const {
    data: patients,
    isLoading: isLoadingPatients
  } = useRecentPatientsQuery()
  const {
    data: tasks,
    isLoading: isTasksLoading
  } = useMyTasksQuery()

  const sortedTasks = useMemo<TaskDTO[]>(() => {
    return [...(tasks ?? [])].sort((a, b) => TaskStatusUtil.compare(a.status, b.status) * -1)
  }, [tasks])

  const cardWidth = 'min-w-64 max-w-64'

  return (
    <div className="flex-col-2 py-4 px-6 @container">
      <TaskDetailModal
        taskId={taskDetailModalId}
        isOpen={!!taskDetailModalId}
        onClose={() => setTaskDetailModalId(undefined)}
      />
      <InvitationBanner/>
      <ColumnTitle title={translation('recent')}/>
      <div className="flex-col-6">
        <LoadingAndErrorComponent isLoading={isTasksLoading} className="min-h-29">
          <div className="col gap-y-1">
            <ColumnTitle title={translation('myTasks')} type="subtitle"/>
            <Scrollbars autoHeight={true} autoHide={true}>
              <div className="flex-row-4">
                {sortedTasks.length > 0 && sortedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => {
                      setTaskDetailModalId(task.id)
                    }}
                    isSelected={false}
                    showStatus={true}
                    className={cardWidth}
                  />
                ))}
                {sortedTasks.length === 0 && (
                  <div
                    className="card-md flex-row-0 items-center justify-center bg-disabled-background text-disabled-text min-w-64 max-w-64 max-h-30 min-h-30"
                  >
                    {translation('noTasks')}
                  </div>
                )}
              </div>
            </Scrollbars>
          </div>
        </LoadingAndErrorComponent>
        <LoadingAndErrorComponent isLoading={isLoadingWards} className="min-h-28">
          <div className="col gap-y-1">
            <ColumnTitle title={translation('wards')} type="subtitle"/>
            <Scrollbars autoHeight={true} autoHide={true}>
              <div className="flex-row-4">
                {wards && wards.length > 0 && wards?.map(ward => (
                  <WardCard
                    key={ward.id}
                    ward={ward}
                    onClick={() => router.push(`/ward/${ward.id}`)}
                    className={cardWidth}
                  />
                ))}
                <AddCard
                  text={translation('addWard')}
                  onClick={() => router.push(`/organizations/${organization?.id}`)}
                  className={cardWidth}
                />
              </div>
            </Scrollbars>
          </div>
        </LoadingAndErrorComponent>
        <LoadingAndErrorComponent isLoading={isLoadingPatients} className="min-h-28">
          {patients && patients.length > 0 && (
            <div className="col gap-y-1">
              <ColumnTitle title={translation('patients')} type="subtitle"/>
              <Scrollbars autoHeight={true} autoHide={true}>
                <div className="flex-col-4">
                  <div className="flex-row-4">
                    {patients?.filter((_, index) => index % 2 == 0).map(patient => (
                      <PatientCard
                        key={patient.id}
                        className={clsx(cardWidth, '!min-h-12')}
                        bedName={patient.bed?.name}
                        patientName={patient.humanReadableIdentifier}
                        onClick={() => {
                          if(patient.wardId) {
                            router.push(`/ward/${patient.wardId}?patientId=${patient.id}`).catch(console.error)
                          } else if(wards && wards.length > 0) {
                            router.push(`/ward/${wards[0]!.id}?patientId=${patient.id}`).catch(console.error)
                          }
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex-row-4">
                    {patients?.filter((_, index) => index % 2 == 1).map(patient => (
                      <PatientCard
                        key={patient.id}
                        className={clsx(cardWidth, '!min-h-12')}
                        bedName={patient.bed?.name}
                        patientName={patient.humanReadableIdentifier}
                        onClick={() => {
                          if(patient.wardId) {
                            router.push(`/ward/${patient.wardId}?patientId=${patient.id}`).catch(console.error)
                          } else if(wards && wards.length > 0) {
                            router.push(`/ward/${wards[0]!.id}?patientId=${patient.id}`).catch(console.error)
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Scrollbars>
            </div>
          )}
        </LoadingAndErrorComponent>
      </div>
    </div>
  )
}
