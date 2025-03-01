import { useEffect, useRef, useState } from 'react'
import { Undo2, X } from 'lucide-react'
import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Select } from '@helpwave/common/components/user-input/Select'
import { noop } from '@helpwave/common/util/noop'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { Button } from '@helpwave/common/components/Button'
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
      className={tw('min-w-[120px]')}
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
      className={tw('min-w-[150px]')}
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
    <div className={tw('flex flex-row justify-between items-center gap-x-4')}>
      <div>
        {isShowingRevert && (
          <Button
            onClick={() => {
              if (hasChanges) {
                setCurrentSelection({ ...initialRoomAndBed })
                setTouched(false)
              }
            }}
            variant="text-border"
            disabled={!hasChanges}
          >
            <div className={tw('flex flex-row gap-x-2 items-center')}>
              {translation.revert}
              <Undo2 size={16}/>
            </div>
          </Button>
        )}
        {isShowingClear && (
          <Button
            onClick={() => {
              setCurrentSelection({
                bedId: undefined,
                roomId: undefined
              })
              setTouched(false)
              onChange({})
            }}
            variant="text-border"
            color="hw-negative"
          >
            <div className={tw('flex flex-row gap-x-2 items-center')}>
              {translation.revert}
              <X size={16}/>
            </div>
          </Button>
        )}
      </div>
      {touched && !isSubmitting && !isCreating && (
        <span className={tx({
          '!text-hw-negative-400': hasChanges,
          '!text-hw-positive-400': !hasChanges
        })}>
          {hasChanges ? translation.unsaved : translation.saved}
        </span>
      )}
      {touched && !isSubmitting && isCreating && (
        <span className={tx({
          '!text-hw-positive-400': currentSelection.roomId && currentSelection.bedId,
          '!text-hw-negative-400': !(currentSelection.roomId && currentSelection.bedId)
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
    <div className={tw('flex flex-col')}>
        <table className={tw('min-w-[200px] border-spacing-y-2 border-separate')}>
          <thead>
            <tr>
              <th><span className={tw('textstyle-table-header flex flex-row justify-start')}>{translation.room}</span></th>
              <th><span className={tw('textstyle-table-header flex flex-row justify-start')}>{translation.bed}</span></th>
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

  const heightLayout = (
    <div className={tw('flex flex-col')}>
      <table className={tw('border-spacing-y-2 border-separate')}>
        <thead/>
        <tbody>
          <tr>
            <td><span className={tw('textstyle-table-header')}>{translation.room}</span></td>
            <td>
              {roomSelect}
            </td>
          </tr>
          <tr>
            <td><span className={tw('textstyle-table-header')}>{translation.bed}</span></td>
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
