import { useContext, useEffect, useRef, useState } from 'react'
import type { Scrollbars } from 'react-custom-scrollbars-2'
import { Plus } from 'lucide-react'
import type { Translation } from '@helpwave/hightide'
import { type PropsForTranslation, SolidButton, useTranslation } from '@helpwave/hightide'
import type { SubtaskDTO } from '@helpwave/api-services/types/tasks/task'
import { SubtaskTile } from './SubtaskTile'
import { TaskTemplateContext } from '@/pages/templates'

type SubtaskViewTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string,
}

const defaultSubtaskViewTranslation: Translation<SubtaskViewTranslation> = {
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
  subtasks: SubtaskDTO[],
  taskOrTemplateId?: string,
  createdBy?: string,
  /**
   * Gives the full list with updates
   *
   * New items are only created locally
   */
  onChange: (subtasks: SubtaskDTO[]) => void,
  /**
   * Callback when an item is added and not creating
   */
  onAdd: (subtask: SubtaskDTO) => void,
  /**
   * Callback when an item is updated and not creating
   */
  onUpdate: (subtask: SubtaskDTO) => void,
  /**
   * Callback when an item is removed and not creating
   */
  onRemove: (subtask: SubtaskDTO) => void,
}

/**
 * A view for editing and showing all subtasks of a task
 */
export const SubtaskView = ({
                              overwriteTranslation,
                              subtasks,
                              taskOrTemplateId,
                              onChange,
                              onAdd,
                              onUpdate,
                              onRemove,
                            }: PropsForTranslation<SubtaskViewTranslation, SubtaskViewProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation([defaultSubtaskViewTranslation], overwriteTranslation)
  const isCreating = taskOrTemplateId === ''

  const scrollableRef = useRef<Scrollbars>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

  // Automatic scrolling to the last element to give the user a visual feedback
  useEffect(() => {
    if (scrollableRef.current && scrollToBottomFlag) {
      scrollableRef.current.scrollToBottom()
    }
    setScrollToBottom(false)
  }, [scrollToBottomFlag, subtasks])

  const removeSubtask = (subtask: SubtaskDTO, index: number) => {
    const filteredSubtasks = subtasks.filter((_, subtaskIndex) => subtaskIndex !== index)
    if (isCreating) {
      context.updateContext({
        ...context.state,
        template: { ...context.state.template, subtasks: filteredSubtasks },
        // index access is safe as the index comes from mapping over the subtasks
        deletedSubtaskIds: [...context.state.deletedSubtaskIds ?? [], subtasks[index]!.id]
      })
    } else {
      onChange(filteredSubtasks)
      onRemove(subtask)
    }
  }

  return (
    <div className="flex-col-2">
      <div className="flex-row-4 items-center justify-between">
        <span className="typography-title-md">{translation('subtasks')}</span>
        <SolidButton
          onClick={() => {
            const newSubtask: SubtaskDTO = {
              id: '',
              name: `${translation('newSubtask')} ${subtasks.length + 1}`,
              isDone: false,
              taskId: taskOrTemplateId ?? ''
            }
            onChange([...subtasks, newSubtask])
            if (!isCreating) {
              onAdd(newSubtask)
            }
            setScrollToBottom(true)
          }}
          size="small"
        >
          <div className="flex-row-2 items-center">
            <Plus size={18}/>
            <span>{translation('addSubtask')}</span>
          </div>
        </SolidButton>
      </div>
      <div className="flex-col-2 overflow-y-auto min-h-96 max-h-96">
        {/* TODO add subtask tile if empty */}
        {subtasks.toSorted((a, b) => a.id.localeCompare(b.id)).map((subtask, index) => (
          <SubtaskTile
            key={index}
            subtask={subtask}
            onChange={newSubtask => {
              const newSubtasks = [...subtasks]
              newSubtasks[index] = newSubtask
              if (subtask.id) {
                onUpdate(newSubtask)
              }
              onChange(newSubtasks)
            }}
            onRemoveClick={() => removeSubtask(subtask, index)}
          />
        ))}
      </div>
    </div>
  )
}
