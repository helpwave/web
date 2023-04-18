import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind/index'
import type { SubTaskDTO } from '../mutations/room_mutations'
import SimpleBarReact from 'simplebar-react'
import { Input } from './user_input/Input'
import { Button } from './Button'
import Add from '@helpwave/common/icons/Add'
import { Checkbox } from './user_input/Checkbox'

type SubtaskViewTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string
}

const defaultSubtaskViewTranslation = {
  en: {
    subtasks: 'Subtasks',
    remove: 'Remove',
    addSubtask: 'Add Subtask',
    newSubtask: 'New Subtask'
  },
  de: {
    subtasks: 'Unteraufgaben',
    remove: 'Entfernen',
    addSubtask: 'Neue Unteraufgabe',
    newSubtask: 'Neue Unteraufgabe'
  }
}

type SubtaskViewProps = {
  subtasks: SubTaskDTO[],
  onChange: (subtasks: SubTaskDTO[]) => void
}

export const SubtaskView = ({
  language,
  subtasks,
  onChange
}: PropsWithLanguage<SubtaskViewTranslation, SubtaskViewProps>) => {
  const translation = useTranslation(language, defaultSubtaskViewTranslation)

  return (
    <div className={tw('flex flex-col')}>
      <span className={tw('font-semibold text-lg mb-1')}>{translation.subtasks}</span>
      <div className={tw('max-h-[500px] overflow-hidden mr-4')}>
        <SimpleBarReact style={{ maxHeight: 500 }}>
          <div className={tw('grid grid-cols-1 gap-y-2')}>
            {subtasks.map((subtask, index) => (
              <div key={index} className={tw('flex flex-row justify-between gap-x-2')}>
                <Checkbox
                  id={subtask.name + 'Checkbox' + index}
                  onChange={checked => {
                    const newSubtasks = [...subtasks]
                    newSubtasks[index].isDone = checked
                    onChange(newSubtasks)
                  }}
                  checked={subtask.isDone}
                  label=""
                />
                <Input
                  value={subtask.name}
                  className={tw('focus:outline-none')}
                  onChange={text => {
                    const newSubtasks = [...subtasks]
                    newSubtasks[index].name = text
                    onChange(newSubtasks)
                  }}
                />
                <button
                  className={tw('text-hw-negative-400 hover:text-hw-negative-500 ml-4')}
                  onClick={() => onChange(subtasks.filter((_, subtaskIndex) => subtaskIndex !== index))}
                >
                  {translation.remove}
                </button>
              </div>
            ))}
          </div>
        </SimpleBarReact>
      </div>
      <Button
        onClick={() => onChange([...subtasks, { name: translation.newSubtask, isDone: false }])}
        className={tw('flex flex-row items-center gap-x-2 mt-4 max-w-[200px] justify-center')}
      >
        <Add/>
        {translation.addSubtask}
      </Button>
    </div>
  )
}
