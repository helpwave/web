import clsx from 'clsx'
import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { Modal, type ModalProps } from '@helpwave/hightide/components/modals/Modal'
import { SolidButton, TextButton } from '@helpwave/hightide/components/Button'
import { defaultTableStatePagination, Table, updatePagination, type TableState } from '@helpwave/hightide/components/Table'
import { useEffect, useState } from 'react'
import { LoadingAndErrorComponent } from '@helpwave/hightide/components/LoadingAndErrorComponent'
import { Input } from '@helpwave/hightide/components/user-input/Input'
import { useRoomOverviewsQuery } from '@helpwave/api-services/mutations/tasks/room_mutations'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import {
  useBedCreateMutation,
  useBedDeleteMutation,
  useBedUpdateMutation
} from '@helpwave/api-services/mutations/tasks/bed_mutations'

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

const defaultManageBedsModalTranslation: Record<Languages, ManageBedsModalTranslation> = {
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
  modalClassName,
  titleText,
  ...modalProps
}: PropsForTranslation<ManageBedsModalTranslation, ManageBedsModalProps>) => {
  const translation = useTranslation(defaultManageBedsModalTranslation, overwriteTranslation)
  const { data, isLoading, isError } = useRoomOverviewsQuery(wardId) // Todo use more optimized query later
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination
  })
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

  const addBed = () => room && addBedMutation.mutate({ id: '', name: `${translation.bed} ${room?.beds.length + 1}`, roomId })

  const maxBedNameLength = 16

  const identifierMapping = (bed: BedWithPatientWithTasksNumberDTO) => bed.id
  return (
    <Modal
      titleText={titleText ?? (room ? `${translation.manageBedsIn} ${room.name}` : '')}
      modalClassName={clsx('min-w-[600px]', modalClassName)}
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
            <div className="row justify-between items-end mb-2 mt-4">
              <span className="textstyle-table-name">{`${translation.beds} (${beds.length})`}</span>
              <SolidButton color="positive" onClick={addBed}>{translation.addBed}</SolidButton>
            </div>
            <Table
              data={beds}
              stateManagement={[tableState, setTableState]}
              identifierMapping={identifierMapping}
              header={[
                <span key="name" className="textstyle-table-header">{translation.name}</span>,
                <span key="patient" className="textstyle-table-header">{translation.patient}</span>,
                <></>
              ]}
              rowMappingToCells={bed => [
                <div key="name" className="row items-center w-10/12 min-w-[50px]">
                  <Input
                    value={bed.name}
                    maxLength={maxBedNameLength}
                    onChange={(text) => {
                      setBeds(beds.map(value => value.id === bed.id ? { ...value, name: text } : value))
                    }}
                    onEditCompleted={(text) => updateBedMutation.mutate({ id: bed.id, name: text, roomId: room.id })}
                  />
                </div>,
                <div key="patient" className="w-20">
                  <span>{bed.patient ? bed.patient.name : '-'}</span>
                </div>,
                <div key="remove" className="row justify-end">
                  <TextButton
                    disabled={!!bed.patient}
                    onClick={() => {
                      deleteBedMutation.mutate(bed.id)
                      setTableState({ pagination: tableState.pagination ? updatePagination(tableState.pagination, beds.length - 1) : undefined })
                    }}
                    color="negative"
                  >
                    {translation.remove}
                  </TextButton>
                </div>
              ]}
            />
          </>
        )}
      </LoadingAndErrorComponent>
    </Modal>
  )
}
