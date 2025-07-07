import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  FillerRowElement,
  InputUncontrolled,
  LoadingAndErrorComponent,
  Modal,
  type ModalProps,
  type PropsForTranslation,
  SolidButton,
  Table,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
import { useEffect, useMemo, useState } from 'react'
import { useRoomOverviewsQuery } from '@helpwave/api-services/mutations/tasks/room_mutations'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import {
  useBedCreateMutation,
  useBedDeleteMutation,
  useBedUpdateMutation
} from '@helpwave/api-services/mutations/tasks/bed_mutations'
import type { ColumnDef } from '@tanstack/react-table'
import { ColumnTitle } from '@/components/ColumnTitle'

type ManageBedsModalTranslation = {
  manageBedsIn: string,
  bed: string,
  beds: string,
  name: string,
  patient: string,
  remove: string,
  addBed: string,
  close: string,
}

const defaultManageBedsModalTranslation: Translation<ManageBedsModalTranslation> = {
  en: {
    manageBedsIn: 'Manage beds in',
    bed: 'Bed',
    beds: '#Beds',
    name: 'Name',
    patient: 'Patient',
    remove: 'Remove',
    addBed: 'Add Bed',
    close: 'Close'
  },
  de: {
    manageBedsIn: 'Betten verwalten in',
    bed: 'Bett',
    beds: '#Betten',
    name: 'Name',
    patient: 'Patient',
    remove: 'Entfernen',
    addBed: 'Hinzufügen',
    close: 'Schließen'
  }
}

export type ManageBedsModalProps = ModalProps & {
  wardId: string, // TODO remove later
  roomId: string,
}

/**
 * A Modal for managing beds
 */
export const ManageBedsModal = ({
                                  overwriteTranslation,
                                  wardId,
                                  roomId,
                                  className,
                                  headerProps,
                                  ...modalProps
                                }: PropsForTranslation<ManageBedsModalTranslation, ManageBedsModalProps>) => {
  const translation = useTranslation([defaultManageBedsModalTranslation], overwriteTranslation)
  const { data, isLoading, isError } = useRoomOverviewsQuery(wardId) // Todo use more optimized query later
  const [beds, setBeds] = useState<BedWithPatientWithTasksNumberDTO[]>([])
  const room = data?.find(value => value.id === roomId)

  useEffect(() => {
    if (data) {
      const beds = room?.beds ?? []
      setBeds(beds)
    }
  }, [data, room])

  const addBedMutation = useBedCreateMutation()
  const updateBedMutation = useBedUpdateMutation()
  const deleteBedMutation = useBedDeleteMutation()

  const maxBedNameLength = 16

  const columns = useMemo<ColumnDef<BedWithPatientWithTasksNumberDTO>[]>(() => [
    {
      id: 'name',
      header: translation('name'),
      cell: ({ cell }) => {
        const bed = beds[cell.row.index]!
        return (
          <InputUncontrolled
            value={bed.name}
            type="text"
            onEditCompleted={(text) => {
              if (room?.id) {
                updateBedMutation.mutate({
                  ...bed,
                  name: text,
                  roomId: room.id
                })
              }
            }}
            minLength={3}
            maxLength={maxBedNameLength}
            className="w-full"
          />
        )
      },
      accessorKey: 'name',
      sortingFn: 'text',
      minSize: 200,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'patientName',
      header: translation('patient'),
      accessorFn: ({ patient }) => patient?.name ?? (<FillerRowElement/>),
      sortingFn: 'text',
      minSize: 190,
      meta: {
        filterType: 'text'
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ cell }) => {
        const bed = beds[cell.row.index]!
        return (
          <TextButton
            onClick={() => {
              deleteBedMutation.mutate(bed.id)
            }}
            color="negative"
            disabled={!!bed?.patient}
          >
            {translation('remove')}
          </TextButton>
        )
      },
      minSize: 140,
      maxSize: 140,
      enableResizing: false,
    }
  ], [beds, deleteBedMutation, room?.id, translation, updateBedMutation])

  const addBed = () => {
    if (room) {
      addBedMutation.mutate({ id: '', name: `${translation('bed')} ${room?.beds.length + 1}`, roomId })
    }
  }

  return (
    <Modal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? (room ? `${translation('manageBedsIn')} ${room.name}` : ''),
      }}
      className={clsx('min-w-[600px]', className)}
      {...modalProps}
    >
      <LoadingAndErrorComponent
        isLoading={isLoading || !data}
        hasError={isError || !beds || !room}
        loadingProps={{ classname: '!h-full min-h-[400px]' }}
        errorProps={{ classname: '!h-full min-h-[400px]' }}
      >
        {room && beds && (
          <>
            <ColumnTitle
              title={`${translation('beds')} (${beds.length})`}
              type="subtitle"
              actions={(
                <SolidButton color="positive" onClick={addBed} size="small">
                  {translation('addBed')}
                </SolidButton>
              )}
            />
            <Table
              data={beds}
              columns={columns}
              fillerRow={() => (<FillerRowElement className="h-10"/>)}
              initialState={{ pagination: { pageSize: 6 } }}
            />
          </>
        )}
      </LoadingAndErrorComponent>
    </Modal>
  )
}
