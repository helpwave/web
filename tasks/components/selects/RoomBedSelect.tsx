import { useEffect, useRef, useState } from 'react'
import { Undo2, X } from 'lucide-react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  noop,
  type PropsForTranslation,
  Select,
  TextButton,
  useTranslation
} from '@helpwave/hightide'
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

const defaultRoomBedSelectTranslation: Translation<RoomBedSelectTranslation> = {
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

export type RoomBedSelectionValue = {
  /**
   * undefined value here means select a room and bed
   */
  roomId?: string,
  bedId?: string,
}

export type RoomBedSelectProps = {
  initialRoomAndBed: RoomBedSelectionValue,
  wardId: string,
  /**
   * Only triggers on valid input
   */
  onChange?: (RoomBedSelectIds: RoomBedSelectionValue) => void,
  isSubmitting?: boolean,
  isClearable?: boolean,
  disabled?: boolean,
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
                                onChange = noop,
                                disabled = false,
                              }: PropsForTranslation<RoomBedSelectTranslation, RoomBedSelectProps>) => {
  const translation = useTranslation([defaultRoomBedSelectTranslation], overwriteTranslation)
  const { data, isError, isLoading } = usePatientAssignmentByWardQuery(wardId)
  const [currentSelection, setCurrentSelection] = useState<RoomBedSelectionValue>({ ...initialRoomAndBed })
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
      className="min-w-[120px] w-full"
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
      disabled={disabled}
    />
  ))

  const bedSelect = (
    <Select
      className="min-w-[150px] w-full"
      value={currentSelection.bedId}
      disabled={!currentSelection.roomId || disabled}
      options={(currentRoom?.beds ?? []).map(value => ({
        value: value.id,
        label: value.name,
        disabled: !!value.patient
      }))}
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
              {translation('revert')}
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
              {translation('revert')}
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
          {hasChanges ? translation('unsaved') : translation('saved')}
        </span>
      )}
      {touched && !isSubmitting && isCreating && (
        <span className={clsx({
          '!text-positive': currentSelection.roomId && currentSelection.bedId,
          '!text-negative': !(currentSelection.roomId && currentSelection.bedId)
        })}>
          {currentSelection.roomId && currentSelection.bedId ? translation('valid') : translation('invalid')}
        </span>
      )}
      {isSubmitting && (
        <span>
          {`${translation('submitting')}...`}
        </span>
      )}
    </div>
  )

  const isUsingWidthLayout = ref.current?.offsetWidth && ref.current.offsetWidth > 300

  return (
    <div ref={ref}>
      <LoadingAndErrorComponent
        isLoading={isLoading}
        hasError={isError || !data}
        className={clsx(
          {
            'min-h-17': isUsingWidthLayout,
            'min-h-22': !isUsingWidthLayout,
          }
        )}
      >
        <div className="col">
          <div
            className={clsx({
              'col': !isUsingWidthLayout,
              'row gap-x-4': isUsingWidthLayout
            })}
          >
            <div className={clsx({
              'col gap-y-1': isUsingWidthLayout,
              'row items-center': !isUsingWidthLayout
            })}>
            <span className="row flex-1 textstyle-table-header justify-start min-w-20 max-w-20">
              {translation('room')}
            </span>
              {roomSelect}
            </div>
            <div className={clsx({
              'col gap-y-1': isUsingWidthLayout,
              'row items-center': !isUsingWidthLayout
            })}>
            <span className="flex flex-1  textstyle-table-header row justify-start min-w-20 max-w-20">
              {translation('bed')}
            </span>
              {bedSelect}
            </div>
          </div>
          {changesAndSaveRow}
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
