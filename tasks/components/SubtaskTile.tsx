import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { Checkbox } from '@helpwave/common/components/user_input/Checkbox'
import { Button } from '@helpwave/common/components/Button'
import type { SubTaskDTO } from '../mutations/task_mutations'

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
  onChange: (subtask: SubTaskDTO) => void
}

/**
 * A tile for showing and editing a subtask used in the SubtaskView
 */
export const SubtaskTile = ({
  language,
  subtask,
  onRemoveClick,
  onChange
}: PropsWithLanguage<SubtaskTileTranslation, SubtaskTileProps>) => {
  const translation = useTranslation(language, defaultSubtaskTileTranslation)

  const minTaskNameLength = 2
  const maxTaskNameLength = 64

  return (
    <div className={tw('flex flex-row gap-x-2 items-center overflow-x-hidden')}>
      <div>
        <Checkbox
          onChange={value => onChange({ ...subtask, isDone: value })}
          checked={subtask.isDone !== undefined ? subtask.isDone : false}
        />
      </div>
      <ToggleableInput
        value={subtask.name}
        className={tw('')}
        onChange={text => onChange({ ...subtask, name: text })}
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
