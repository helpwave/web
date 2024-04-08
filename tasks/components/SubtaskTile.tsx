import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user-input/ToggleableInput'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { Button } from '@helpwave/common/components/Button'
import { noop } from '@helpwave/common/util/noop'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { Task } from '@/mutations/task_mutations'

type SubtaskTileTranslation = {
  remove: string
}

const defaultSubtaskTileTranslation: Record<Languages, SubtaskTileTranslation> = {
  en: {
    remove: 'Remove'
  },
  de: {
    remove: 'Entfernen'
  }
}

type SubtaskTileProps = {
  subtask: Task,
  onRemoveClick: () => void,
  onNameChange: (subtask: Task) => void,
  onNameEditCompleted?: (subtask: Task) => void,
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

  return (
    <div className={tw('flex flex-row gap-x-2 items-center overflow-x-hidden')}>
      <div>
        <Checkbox
          onChange={done => {
            onDoneChange(done)
          }}
          checked={subtask.status === TaskStatus.TASK_STATUS_DONE}
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
