import { useEffect, useState } from 'react'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user-input/ToggleableInput'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { Button } from '@helpwave/common/components/Button'
import { noop } from '@helpwave/common/util/noop'
import type { SubTaskDTO } from '@/mutations/task_mutations'

type SubtaskTileTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string
}

const defaultSubtaskTileTranslation = {
  en: {
    remove: 'Remove'
  },
  de: {
    remove: 'Entfernen'
  }
}

type SubtaskTileProps = {
  subtask: SubTaskDTO,
  onRemoveClick: () => void,
  onNameChange: (subtask: SubTaskDTO) => void,
  onNameEditCompleted?: (subtask: SubTaskDTO) => void,
  onDoneChange: (done: boolean) => void
}

/**
 * A tile for showing and editing a subtask used in the SubtaskView
 */
export const SubtaskTile = ({
  overwriteTranslation,
  subtask,
  onRemoveClick,
  onNameChange,
  onNameEditCompleted = noop,
  onDoneChange
}: PropsForTranslation<SubtaskTileTranslation, SubtaskTileProps>) => {
  const translation = useTranslation(defaultSubtaskTileTranslation, overwriteTranslation)

  const minTaskNameLength = 2
  const maxTaskNameLength = 64
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(subtask.isDone)
  }, [subtask.isDone])

  return (
    <div className={tw('flex flex-row gap-x-2 items-center overflow-x-hidden')}>
      <div>
        <Checkbox
          onChange={done => {
            onDoneChange(done)
            setChecked(subtask.isDone)
          }}
          checked={checked}
        />
      </div>
      <ToggleableInput
        value={subtask.name}
        className={tw('')}
        onChange={text => onNameChange({ ...subtask, name: text })}
        onEditCompleted={text => onNameEditCompleted({ ...subtask, name: text })}
        id={subtask.name}
        minLength={minTaskNameLength}
        maxLength={maxTaskNameLength}
      />
      <Button
        className={tw('ml-4')}
        onClick={onRemoveClick}
        aria-label={translation.remove}
        variant="textButton"
        color="negative"
      >
        {translation.remove}
      </Button>
    </div>
  )
}
