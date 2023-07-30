import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useAssignBedMutation, usePatientAssignmentByWardQuery } from '../mutations/patient_mutations'
import { useEffect, useState } from 'react'
import { Undo2 } from 'lucide-react'
import { Select } from '@helpwave/common/components/user_input/Select'
import { Span } from '@helpwave/common/components/Span'
import { noop } from '@helpwave/common/util/noop'

type RoomBedDropDownTranslation = {
  saved: string,
  unsaved: string
}

const defaultRoomBedDropDownTranslation: Record<Languages, RoomBedDropDownTranslation> = {
  en: {
    saved: 'saved',
    unsaved: 'not saved'
  },
  de: {
    saved: 'gespeichert',
    unsaved: 'nicht gespeichert'
  }
}

export type RoomBedDropDownIDs = {
  roomID : string,
  bedID?: string,
  patientID: string
}

export type RoomBedDropDownProps = {
  initialRoomAndBed: RoomBedDropDownIDs,
  wardID: string,
  onChange?: (roomBedDropDownIDs:RoomBedDropDownIDs) => void
}

/**
 * A DropDown to move a patient to a new bed
 */
export const RoomBedDropDown = ({
  language,
  initialRoomAndBed,
  wardID,
  onChange = noop
}: PropsWithLanguage<RoomBedDropDownTranslation, RoomBedDropDownProps>) => {
  const translation = useTranslation(language, defaultRoomBedDropDownTranslation)
  const { data, isError, isLoading } = usePatientAssignmentByWardQuery(wardID)
  const [currentSelection, setCurrentSelection] = useState<RoomBedDropDownIDs>({ ...initialRoomAndBed })
  const assignBedMutation = useAssignBedMutation(() => onChange(currentSelection))

  const currentRoom = data?.find(value => value.id === currentSelection.roomID)

  useEffect(() => {
    setCurrentSelection(initialRoomAndBed)
  }, [initialRoomAndBed])

  // TODO use loading component
  if (isLoading) {
    return <div>Loading RoomBedDropDown</div>
  }

  if (isError || !data || !currentRoom) {
    return <div>Error in RoomBedDropDown</div>
  }

  const hasChanges = initialRoomAndBed.bedID !== currentSelection.bedID || initialRoomAndBed.roomID !== currentSelection.roomID
  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <div className={tw('flex flex-row gap-x-2 items-center')}>
        <Select
          className={tw('min-w-[100px]')}
          value={currentSelection.roomID}
          options={data.map(room => ({ value: room.id, label: room.name }))}
          onChange={value => setCurrentSelection({ ...currentSelection, roomID: value, bedID: undefined })}
        />
        <Select
          className={tw('min-w-[100px]')}
          value={currentSelection.bedID}
          options={currentRoom.beds.map(value => ({ value: value.id, label: value.name }))}
          onChange={value => {
            setCurrentSelection({
              ...currentSelection,
              bedID: value
            })
            assignBedMutation.mutate({ id: value, patientID: initialRoomAndBed.patientID })
          }}
        />
        <div
          className={tx('h-4 w-4 text-transparent', { '!text-black cursor-pointer': hasChanges })}
          onClick={() => {
            if (hasChanges) {
              setCurrentSelection({ ...initialRoomAndBed })
            }
          }}
        ><Undo2/></div>
      </div>
      <Span className={tx({ '!text-hw-negative-400': hasChanges, '!text-hw-positive-400': !hasChanges })}>{hasChanges ? translation.unsaved : translation.saved}</Span>
    </div>
  )
}
