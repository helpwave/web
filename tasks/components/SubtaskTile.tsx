import { useEffect, useState } from 'react'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'

import { ToggleableInput } from '@helpwave/hightide'
import { Checkbox } from '@helpwave/hightide'
import { TextButton } from '@helpwave/hightide'
import type { SubTaskDTO } from '@helpwave/api-services/types/tasks/task'

type SubtaskTileTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string,
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
  onChange: (subtask: SubTaskDTO) => void,
}

/**
 * A tile for showing and editing a subtask used in the SubtaskView
 */
export const SubtaskTile = ({
  overwriteTranslation,
  subtask,
  onRemoveClick,
  onChange,
}: PropsForTranslation<SubtaskTileTranslation, SubtaskTileProps>) => {
  const translation = useTranslation(defaultSubtaskTileTranslation, overwriteTranslation)

  const minTaskNameLength = 2
  const maxTaskNameLength = 64
  const [localSubtask, setLocalSubtask] = useState<SubTaskDTO>({ ...subtask })

  useEffect(() => {
    setLocalSubtask(subtask)
  }, [subtask])

  return (
    <div className="row gap-x-2 items-center overflow-x-hidden">
      <div>
        <Checkbox
          onChange={isDone => {
            const newSubtask: SubTaskDTO = {
              ...localSubtask,
              isDone
            }
            onChange(newSubtask)
            setLocalSubtask(newSubtask)
          }}
          checked={localSubtask.isDone}
        />
      </div>
      <ToggleableInput
        value={subtask.name}
        onChange={name => setLocalSubtask({
          ...subtask,
          name
        })}
        onEditCompleted={name => {
          const newSubtask: SubTaskDTO = {
            ...localSubtask,
            name
          }
          onChange(newSubtask)
          setLocalSubtask(newSubtask)
        }}
        id={subtask.name}
        minLength={minTaskNameLength}
        maxLength={maxTaskNameLength}
      />
      <TextButton
        className="ml-4"
        onClick={onRemoveClick}
        aria-label={translation.remove}
        color="negative"
      >
        {translation.remove}
      </TextButton>
    </div>
  )
}
