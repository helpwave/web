import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useAssignBedMutation, usePatientAssignmentByWardQuery } from '../mutations/patient_mutations'
import { useEffect, useRef, useState } from 'react'
import { Undo2 } from 'lucide-react'
import { Select } from '@helpwave/common/components/user_input/Select'
import { Span } from '@helpwave/common/components/Span'
import { noop } from '@helpwave/common/util/noop'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Button } from '@helpwave/common/components/Button'

type RoomBedDropDownTranslation = {
  saved: string,
  unsaved: string,
  room: string,
  bed: string,
  revert: string,
  submitting: string
}

const defaultRoomBedDropDownTranslation: Record<Languages, RoomBedDropDownTranslation> = {
  en: {
    saved: 'saved',
    unsaved: 'not saved',
    room: 'Room',
    bed: 'Bed',
    revert: 'Revert',
    submitting: 'Submitting'
  },
  de: {
    saved: 'gespeichert',
    unsaved: 'nicht gespeichert',
    room: 'Raum',
    bed: 'Bett',
    revert: 'Rückgängig',
    submitting: 'Senden'
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
  const ref = useRef<HTMLDivElement>(null)
  const currentRoom = data?.find(value => value.id === currentSelection.roomID)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const assignBedMutation = useAssignBedMutation(() => {
    onChange(currentSelection)
    setSubmitting(false)
  })

  useEffect(() => {
    setCurrentSelection(initialRoomAndBed)
  }, [initialRoomAndBed])

  const hasChanges = initialRoomAndBed.bedID !== currentSelection.bedID || initialRoomAndBed.roomID !== currentSelection.roomID

  const roomSelect = (data && (
    <Select
      className={tw('min-w-[120px]')}
      value={currentSelection.roomID}
      options={data.map(room => ({ value: room.id, label: room.name, disabled: room.beds.length === 0 }))}
      onChange={value => {
        setCurrentSelection({
          ...currentSelection,
          roomID: value,
          bedID: undefined
        })
        setTouched(true)
      }}
    />
  ))

  const bedSelect = (currentRoom && (
    <Select
      className={tw('min-w-[150px]')}
      value={currentSelection.bedID}
      options={currentRoom.beds.map(value => ({ value: value.id, label: value.name, disabled: !!value.patient }))}
      onChange={value => {
        setCurrentSelection({
          ...currentSelection,
          bedID: value
        })
        setTouched(true)
        setSubmitting(true)
        assignBedMutation.mutate({ id: value, patientID: initialRoomAndBed.patientID })
      }}
    />
  ))

  const changesAndSaveRow = (
    <div className={tw('flex flex-row justify-between items-center')}>
      {touched && hasChanges && !submitting ? (
        <Button
          onClick={() => {
            if (hasChanges) {
              setCurrentSelection({ ...initialRoomAndBed })
              setTouched(false)
            }
          }}
          variant="tertiary"
          disabled={!hasChanges}
        >
          <div className={tw('flex flex-row gap-x-2 items-center')}>
            {translation.revert}
            <Undo2 size={16}/>
          </div>
        </Button>
      ) : <div></div>}
      {touched && !submitting && (
        <Span className={tx({
          '!text-hw-negative-400': hasChanges,
          '!text-hw-positive-400': !hasChanges
        })}>
          {hasChanges ? translation.unsaved : translation.saved}
        </Span>
      )}
      {submitting && (
        <Span>
          {`${translation.submitting}...`}
        </Span>
      )}
    </div>
  )

  const widthLayout = (
    <div className={tw('flex flex-col')}>
        <table className={tw('min-w-[200px] border-spacing-y-2 border-separate')}>
          <thead>
            <tr>
              <th><Span className={tw('flex flex-row justify-start')} type="tableHeader">{translation.room}</Span></th>
              <th><Span className={tw('flex flex-row justify-start')} type="tableHeader">{translation.bed}</Span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tw('pr-4')}>
                {roomSelect}
              </td>
              <td>
                {bedSelect}
              </td>
            </tr>
          </tbody>
        </table>
        {changesAndSaveRow}
    </div>
  )

  const heightLayout = (data && currentRoom && (
    <div className={tw('flex flex-col')}>
      <table className={tw('border-spacing-y-2 border-separate')}>
        <thead/>
        <tbody>
          <tr>
            <td><Span type="tableHeader">{translation.room}</Span></td>
            <td>
              {roomSelect}
            </td>
          </tr>
          <tr>
            <td><Span type="tableHeader">{translation.bed}</Span></td>
            <td>
              {bedSelect}
            </td>
          </tr>
        </tbody>
      </table>
      {changesAndSaveRow}
    </div>
  ))

  return (
    <div ref={ref}>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError || !data || !currentRoom}
      >
        {ref.current?.offsetWidth && ref.current.offsetWidth > 300 ? widthLayout : heightLayout}
      </LoadingAndErrorComponent>
    </div>
  )
}
