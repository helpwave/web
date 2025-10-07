import { useEffect, useRef, useState } from 'react'
import { Undo2, X } from 'lucide-react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { SelectOption } from '@helpwave/hightide'
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
    valid: 'Zulässig',
    invalid: 'Nicht zulässig',
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
      value={currentSelection.roomId}
      onValueChanged={value => {
        const room = data?.find(room => room.id === value)
        if(room) {
          setCurrentSelection({
            ...currentSelection,
            roomId: value,
            bedId: undefined
          })
          setTouched(true)
        }
      }}
      buttonProps={{
        className: 'min-w-36 w-full',
        selectedDisplay: (value) => {
          const room = data?.find(room => room.id === value)
          if(room) {
            return room.name
          }
          return '-'
        }
      }}
      disabled={disabled}
    >
      {data.map(room => (
        <SelectOption key={room.id} value={room.id} disabled={room.beds.length === 0 }>
          {room.name}
        </SelectOption>
      ))}
    </Select>
  ))

  const bedSelect = (
    <Select
      value={currentSelection.bedId}
      disabled={!currentSelection.roomId || disabled}
      onValueChanged={value => {
        const newSelection = {
          ...currentSelection,
          bedId: value
        }
        setCurrentSelection(newSelection)
        setTouched(true)
        onChange(newSelection)
      }}
      buttonProps={{
        className: 'min-w-36 w-full',
        selectedDisplay: (value) => {
          const bed = currentRoom?.beds.find(bed => bed.id === value)
          if(bed) {
            return bed.name
          }
          return '-'
        }
      }}
    >
      {currentRoom?.beds.map(bed => (
        <SelectOption key={bed.id} value={bed.id} disabled={!!bed.patient}>
          {bed.name}
        </SelectOption>
      ))}
    </Select>
  )
  const isShowingClear = isClearable && !isSubmitting && touched
  const isShowingRevert = touched && hasChanges && !isSubmitting && !isCreating && !isClearable
  const changesAndSaveRow = (
    <div className="flex-row-4 justify-between items-center">
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
            <div className="flex-row-2 items-center">
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
            <div className="flex-row-2 items-center">
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
        <div className="flex-col-0">
          <div
            className={clsx({
              'flex-col-2': !isUsingWidthLayout,
              'flex-row-4': isUsingWidthLayout
            })}
          >
            <div className={clsx({
              'flex-col-1': isUsingWidthLayout,
              'flex-row-2 items-center': !isUsingWidthLayout
            })}>
            <span className="flex-row-1 typography-label-md justify-start min-w-20 max-w-20">
              {translation('room')}
            </span>
              {roomSelect}
            </div>
            <div className={clsx({
              'flex-col-1': isUsingWidthLayout,
              'flex-row-2 items-center': !isUsingWidthLayout
            })}>
            <span className="flex-row-1 typography-label-md justify-start min-w-20 max-w-20">
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
