import { useEffect, useRef, useState } from 'react'
import { Undo2, X } from 'lucide-react'
import clsx from 'clsx'
import type { Languages } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Select } from '@helpwave/hightide'
import { noop } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { TextButton } from '@helpwave/hightide'
import { usePatientAssignmentByWardQuery } from '@helpwave/api-services/mutations/tasks/patient_mutations'

type RoomBedSelectTranslation = {
  saved: string,
  unsaved: string,
  valid: string,
  invalid: string,
  room: string,
  bed: string,
  revert: string,
  submitting: string,
}

const defaultRoomBedSelectTranslation: Record<Languages, RoomBedSelectTranslation> = {
  en: {
    saved: 'saved',
    unsaved: 'not saved',
    valid: 'valid',
    invalid: 'invalid',
    room: 'Room',
    bed: 'Bed',
    revert: 'Revert',
    submitting: 'Submitting',

  },
  de: {
    saved: 'gespeichert',
    unsaved: 'nicht gespeichert',
    valid: 'okay',
    invalid: 'nicht okay',
    room: 'Raum',
    bed: 'Bett',
    revert: 'Rückgängig',
    submitting: 'Senden'
  }
}

export type RoomBedSelectIds = {
  /**
   * undefined value here means select a room and bed
   */
  roomId?: string,
  bedId?: string,
}

export type RoomBedSelectProps = {
  initialRoomAndBed: RoomBedSelectIds,
  wardId: string,
  /**
   * Only triggers on valid input
   */
  onChange?: (RoomBedSelectIds:RoomBedSelectIds) => void,
  isSubmitting?: boolean,
  isClearable?: boolean,
}

/**
 * A Select to move a patient to a new bed
 */
export const RoomBedSelect = ({
  overwriteTranslation,
  initialRoomAndBed,
  wardId,
  isSubmitting = false,
  isClearable = false,
  onChange = noop
}: PropsForTranslation<RoomBedSelectTranslation, RoomBedSelectProps>) => {
  const translation = useTranslation(defaultRoomBedSelectTranslation, overwriteTranslation)
  const { data, isError, isLoading } = usePatientAssignmentByWardQuery(wardId)
  const [currentSelection, setCurrentSelection] = useState<RoomBedSelectIds>({ ...initialRoomAndBed })
  const ref = useRef<HTMLDivElement>(null)
  const currentRoom = data?.find(value => value.id === currentSelection.roomId)
  const [touched, setTouched] = useState(false)
  const isCreating = !initialRoomAndBed.roomId

  useEffect(() => {
    setCurrentSelection(initialRoomAndBed)
  }, [initialRoomAndBed])

  const hasChanges = initialRoomAndBed.bedId !== currentSelection.bedId || initialRoomAndBed.roomId !== currentSelection.roomId

  const roomSelect = (data && (
    <Select
      className="min-w-[120px]"
      value={currentSelection.roomId}
      options={data.map(room => ({ value: room.id, label: room.name, disabled: room.beds.length === 0 }))}
      onChange={value => {
        setCurrentSelection({
          ...currentSelection,
          roomId: value,
          bedId: undefined
        })
        setTouched(true)
      }}
    />
  ))

  const bedSelect = (
    <Select
      className="min-w-[150px]"
      value={currentSelection.bedId}
      isDisabled={!currentSelection.roomId}
      options={(currentRoom?.beds ?? []).map(value => ({ value: value.id, label: value.name, disabled: !!value.patient }))}
      onChange={value => {
        const newSelection = {
          ...currentSelection,
          bedId: value
        }
        setCurrentSelection(newSelection)
        setTouched(true)
        onChange(newSelection)
      }}
    />
  )
  const isShowingClear = isClearable && !isSubmitting && touched
  const isShowingRevert = touched && hasChanges && !isSubmitting && !isCreating && !isClearable
  const changesAndSaveRow = (
    <div className="row justify-between items-center gap-x-4">
      <div>
        {isShowingRevert && (
          <TextButton
            onClick={() => {
              if (hasChanges) {
                setCurrentSelection({ ...initialRoomAndBed })
                setTouched(false)
              }
            }}
            disabled={!hasChanges}
          >
            <div className="row gap-x-2 items-center">
              {translation.revert}
              <Undo2 size={16}/>
            </div>
          </TextButton>
        )}
        {isShowingClear && (
          <TextButton
            onClick={() => {
              setCurrentSelection({
                bedId: undefined,
                roomId: undefined
              })
              setTouched(false)
              onChange({})
            }}
            color="negative"
          >
            <div className="row gap-x-2 items-center">
              {translation.revert}
              <X size={16}/>
            </div>
          </TextButton>
        )}
      </div>
      {touched && !isSubmitting && !isCreating && (
        <span className={clsx({
          '!text-negative': hasChanges,
          '!text-positive': !hasChanges
        })}>
          {hasChanges ? translation.unsaved : translation.saved}
        </span>
      )}
      {touched && !isSubmitting && isCreating && (
        <span className={clsx({
          '!text-positive': currentSelection.roomId && currentSelection.bedId,
          '!text-negative': !(currentSelection.roomId && currentSelection.bedId)
        })}>
          {currentSelection.roomId && currentSelection.bedId ? translation.valid : translation.invalid}
        </span>
      )}
      {isSubmitting && (
        <span>
          {`${translation.submitting}...`}
        </span>
      )}
    </div>
  )

  const widthLayout = (
    <div className="col">
        <table className="min-w-[200px] border-spacing-y-2 border-separate">
          <thead>
            <tr>
              <th><span className="textstyle-table-header row justify-start">{translation.room}</span></th>
              <th><span className="textstyle-table-header row justify-start">{translation.bed}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-4">
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

  const heightLayout = (
    <div className="col">
      <table className="border-spacing-y-2 border-separate">
        <thead/>
        <tbody>
          <tr>
            <td><span className="textstyle-table-header">{translation.room}</span></td>
            <td>
              {roomSelect}
            </td>
          </tr>
          <tr>
            <td><span className="textstyle-table-header">{translation.bed}</span></td>
            <td>
              {bedSelect}
            </td>
          </tr>
        </tbody>
      </table>
      {changesAndSaveRow}
    </div>
  )

  return (
    <div ref={ref}>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError || !data}
      >
        {ref.current?.offsetWidth && ref.current.offsetWidth > 300 ? widthLayout : heightLayout}
      </LoadingAndErrorComponent>
    </div>
  )
}
