import clsx from 'clsx'
import type { DialogProps, Translation } from '@helpwave/hightide'
import {
  Dialog,
  FillerRowElement,
  InputUncontrolled,
  LoadingAndErrorComponent,
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
  manageBeds: string,
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
    close: 'Close',
    manageBeds: 'Change the beds in the ward by renaming, adding or deleting them.'
  },
  de: {
    manageBedsIn: 'Betten verwalten in',
    bed: 'Bett',
    beds: '#Betten',
    name: 'Name',
    patient: 'Patient',
    remove: 'Entfernen',
    addBed: 'Hinzufügen',
    close: 'Schließen',
    manageBeds: 'Ändere die Betten in der Station durch umbennen, hinzufügen oder löschen.'
  }
}

export type ManageBedsModalProps = Omit<DialogProps, 'titleElement' | 'description'> & {
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
      accessorFn: ({ patient }) => patient?.humanReadableIdentifier ?? (<FillerRowElement/>),
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
    <Dialog
      {...modalProps}
      className={clsx('min-w-[600px]', className)}
      titleElement={room ? `${translation('manageBedsIn')} ${room.name}` : translation('beds')}
      description={translation('manageBeds')}
    >
      <ColumnTitle
        title={`${translation('beds')} (${beds?.length ?? 0})`}
        type="subtitle"
        actions={room && beds && (
          <SolidButton color="positive" onClick={addBed} size="small">
            {translation('addBed')}
          </SolidButton>
        )}
      />
      <LoadingAndErrorComponent
        isLoading={isLoading || !data}
        hasError={isError || !beds || !room}
      >
        {room && beds && (
          <Table
            data={beds}
            columns={columns}
            fillerRow={() => (<FillerRowElement className="h-10"/>)}
            initialState={{ pagination: { pageSize: 6 } }}
          />
        )}
      </LoadingAndErrorComponent>
    </Dialog>
  )
}
