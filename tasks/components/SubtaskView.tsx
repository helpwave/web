import { useContext, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Plus } from 'lucide-react'

import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton } from '@helpwave/common/components/Button'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { SubTaskDTO } from '@helpwave/api-services/types/tasks/task'
import {
  useSubTaskAddMutation,
  useSubTaskDeleteMutation,
  useSubTaskUpdateMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import { SubtaskTile } from './SubtaskTile'
import { TaskTemplateContext } from '@/pages/templates'

type SubtaskViewTranslation = {
  subtasks: string,
  remove: string,
  addSubtask: string,
  newSubtask: string,
}

const defaultSubtaskViewTranslation: Record<Languages, SubtaskViewTranslation> = {
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
  // TODO: This component should not decide between two mutate functions. Pass mutate function instead.
  subtasks: SubTaskDTO[],
  taskId?: string,
  createdBy?: string,
  taskTemplateId?: string,
  onChange: (subtasks: SubTaskDTO[]) => void,
}

/**
 * A view for editing and showing all subtasks of a task
 */
export const SubtaskView = ({
  overwriteTranslation,
  subtasks,
  taskId,
  onChange,
}: PropsForTranslation<SubtaskViewTranslation, SubtaskViewProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation(defaultSubtaskViewTranslation, overwriteTranslation)
  const isCreatingTask = taskId === ''
  const addSubtaskMutation = useSubTaskAddMutation(taskId)
  const deleteSubtaskMutation = useSubTaskDeleteMutation()
  const updateSubtaskMutation = useSubTaskUpdateMutation(taskId)

  const scrollableRef = useRef<Scrollbars>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

  // Automatic scrolling to the last element to give the user a visual feedback
  useEffect(() => {
    if (scrollableRef.current && scrollToBottomFlag) {
      scrollableRef.current.scrollToBottom()
    }
    setScrollToBottom(false)
  }, [scrollToBottomFlag, subtasks])

  const removeSubtask = (subtask: SubTaskDTO, index: number) => {
    const filteredSubtasks = subtasks.filter((_, subtaskIndex) => subtaskIndex !== index)
    // undefined because taskId === "" would mean task creation // TODO: this seems like a terrible way of differentiating things..
    if (taskId === undefined) {
      context.updateContext({
        ...context.state,
        template: { ...context.state.template, subtasks: filteredSubtasks },
        // index access is safe as the index comes from mapping over the subtasks
        deletedSubtaskIds: [...context.state.deletedSubtaskIds ?? [], subtasks[index]!.id]
      })
    } else {
      onChange(filteredSubtasks)
      deleteSubtaskMutation.mutate(subtask.id)
    }
  }

  return (
    <div className="col gap-y-2">
      <div className="row items-center justify-between">
        <span className="textstyle-title-normal">{translation.subtasks}</span>
        <SolidButton
          onClick={() => {
            const newSubtask = { id: '', name: `${translation.newSubtask} ${subtasks.length + 1}`, isDone: false }
            onChange([...subtasks, newSubtask])
            if (!isCreatingTask) {
              addSubtaskMutation.mutate(newSubtask)
            }
            setScrollToBottom(true)
          }}
        >
          <div className="row items-center gap-x-2">
            <Plus size={18}/>
            <span>{translation.addSubtask}</span>
          </div>
        </SolidButton>
      </div>
      <div className="max-h-[500px] overflow-hidden">
        <Scrollbars autoHide={true} ref={scrollableRef} className="h-screen" style={{ minHeight: 250 }}>
          <div className="grid grid-cols-1 gap-y-2">
            {subtasks.map((subtask, index) => (
              <SubtaskTile
                key={index}
                subtask={subtask}
                onChange={newSubtask => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index] = newSubtask
                  if (subtask.id) {
                    updateSubtaskMutation.mutate(newSubtask)
                  }
                  onChange(newSubtasks)
                }}
                onRemoveClick={() => removeSubtask(subtask, index)}
              />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}
