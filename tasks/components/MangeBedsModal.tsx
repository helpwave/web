import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import type { ModalProps } from '@helpwave/common/components/modals/Modal'
import { Modal } from '@helpwave/common/components/modals/Modal'
import { useRoomOverviewsQuery } from '../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import type {
  TableState
} from '@helpwave/common/components/Table'
import {
  defaultTableStatePagination,
  Table, updatePagination
} from '@helpwave/common/components/Table'
import { useState } from 'react'
import type { BedWithPatientWithTasksNumberDTO } from '../mutations/bed_mutations'
import { useBedCreateMutation, useBedDeleteMutation } from '../mutations/bed_mutations'
import { noop } from '@helpwave/common/util/noop'
import { X } from 'lucide-react'

type ManageBedsModalTranslation = {
  manageBedsIn: string,
  bed: string,
  beds: string,
  name: string,
  patient: string,
  remove: string,
  addBed: string,
  close: string
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

export type ManageBedsModalProps = Omit<ModalProps, 'title'|'description'> & {
  wardID: string, // TODO remove later
  roomID: string,
  onClose?: () => void
}

/**
 * Description
 */
export const ManageBedsModal = ({
  language,
  wardID,
  roomID,
  onClose = noop,
  modalClassName,
  ...ModalProps
}: PropsWithLanguage<ManageBedsModalTranslation, ManageBedsModalProps>) => {
  const translation = useTranslation(language, defaultManageBedsModalTranslation)
  const { data, isLoading, isError } = useRoomOverviewsQuery(wardID) // Todo use more optimized query later
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination
  })
  const addBedMutation = useBedCreateMutation()
  const deleteBedMutation = useBedDeleteMutation()

  // TODO add view for loading
  if (isLoading || !data) {
    return <div>Loading ManageBedsModal</div>
  }

  const room = data.find(value => value.id === roomID)
  const beds = room?.beds
  // TODO add view for error or error handling
  if (isError || !beds || !room) {
    return <div>Error ManageBedsModal</div>
  }

  const identifierMapping = (bed: BedWithPatientWithTasksNumberDTO) => bed.id
  return (
    <Modal modalClassName={tx('min-w-[600px]', modalClassName)} {...ModalProps}>
      <div className={tw('flex flex-row justify-between items-center mb-4')}>
        <Span className={tw('text-lg font-semibold')}>{`${translation.manageBedsIn} ${room.name}`}</Span>
        <div className={tw('flex flex-row gap-x-4 items-end')} onClick={() => onClose()}>
          <Span>{translation.close}</Span>
          <X/>
        </div>
      </div>
      <div className={tw('flex flex-row justify-between items-end mb-2')}>
        <Span type="tableName">{`${translation.beds} (${beds.length})`}</Span>
        <Button color="positive" onClick={() => addBedMutation.mutate(roomID)}>{translation.addBed}</Button>
      </div>
      <Table
        data={beds}
        stateManagement={[tableState, setTableState]}
        identifierMapping={identifierMapping}
        header={[
          <Span key="name" type="tableHeader">{translation.name}</Span>,
          <Span key="patient" type="tableHeader">{translation.patient}</Span>,
          <></>
        ]}
        rowMappingToCells={bed => [
          <div key="name" className={tw('flex flex-row items-center w-10/12 min-w-[50px]')}>
            <Span>{`${translation.bed} ${bed.index}`}</Span>
          </div>,
          <div key="patient" className={tw('w-20')}>
            <Span>{bed.patient ? bed.patient.name : '-'}</Span>
          </div>,
          <div key="remove" className={tw('flex flex-row justify-end')}>
            <Button
              disabled={!!bed.patient}
              onClick={() => {
                deleteBedMutation.mutate(bed.id)
                setTableState({ pagination: tableState.pagination ? updatePagination(tableState.pagination, beds.length - 1) : undefined })
              }}
              color="negative"
              variant="textButton"
            >
              {translation.remove}
            </Button>
          </div>
        ]}
      />
    </Modal>
  )
}