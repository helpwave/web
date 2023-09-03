import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Plus } from 'lucide-react'
import { Button } from '@helpwave/common/components/Button'
import { SubtaskTile } from './SubtaskTile'
import { Span } from '@helpwave/common/components/Span'
import { useContext, useEffect, useRef, useState } from 'react'
import type { SubTaskDTO } from '../mutations/task_mutations'
import { TaskTemplateContext } from '../pages/templates'
import { Scrollbars } from 'react-custom-scrollbars-2'
import {
  useSubTaskAddMutation,
  useSubTaskDeleteMutation,
  useSubTaskToDoneMutation, useSubTaskToToDoMutation,
  useSubTaskUpdateMutation
} from '../mutations/task_mutations'

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
  // TODO: This component should not decide between two mutate functions. Pass mutate function instead.
  subtasks: SubTaskDTO[],
  taskId?: string,
  createdBy?: string,
  taskTemplateId?: string,
  onChange: (subtasks: SubTaskDTO[]) => void
}

/**
 * A view for editing and showing all subtasks of a task
 */
export const SubtaskView = ({
  language,
  subtasks,
  taskId,
  taskTemplateId,
  onChange,
}: PropsWithLanguage<SubtaskViewTranslation, SubtaskViewProps>) => {
  const context = useContext(TaskTemplateContext)

  const translation = useTranslation(language, defaultSubtaskViewTranslation)
  const isCreatingTask = taskId === ''
  const addSubtaskMutation = useSubTaskAddMutation(taskId)
  const deleteSubtaskMutation = useSubTaskDeleteMutation()
  const updateSubtaskMutation = useSubTaskUpdateMutation()
  const setSubtaskToToDoMutation = useSubTaskToToDoMutation()
  const setSubtaskToDoneMutation = useSubTaskToDoneMutation()

  const scrollableRef = useRef<Scrollbars>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

  // Automatic scrolling to the last element to give the user a visual feedback
  useEffect(() => {
    if (scrollableRef.current && scrollToBottomFlag) {
      scrollableRef.current.scrollToBottom()
    }
    setScrollToBottom(false)
  }, [scrollToBottomFlag, subtasks])

  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <div className={tw('flex flex-row items-center justify-between')}>
        <Span type="subsectionTitle">{translation.subtasks}</Span>
        <Button
          onClick={() => {
            const newSubtask = { id: '', name: `${translation.newSubtask} ${subtasks.length + 1}`, isDone: false }
            onChange([...subtasks, newSubtask])
            if (!isCreatingTask) {
              addSubtaskMutation.mutate(newSubtask)
            }
            setScrollToBottom(true)
          }}
        >
          <div className={tw('flex flex-row items-center gap-x-2')}>
            <Plus size={18}/>
            <Span>{translation.addSubtask}</Span>
          </div>
        </Button>
      </div>
      <div className={tw('max-h-[500px] overflow-hidden')}>
        <Scrollbars autoHide={true} ref={scrollableRef} className={tw('h-screen')} style={{ minHeight: 250 }}>
          <div className={tw('grid grid-cols-1 gap-y-2')}>
            {subtasks.map((subtask, index) => (
              <SubtaskTile
                key={index}
                subtask={subtask}
                onNameChange={newSubtask => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index] = newSubtask
                  onChange(newSubtasks)
                }}
                onNameEditCompleted={newSubtask => {
                  if (!isCreatingTask) {
                    updateSubtaskMutation.mutate(newSubtask)
                  }
                }}
                onRemoveClick={() => {
                  const filteredSubtasks = subtasks.filter((_, subtaskIndex) => subtaskIndex !== index)
                  // undefined because taskId === "" would mean task creation
                  if (taskId === undefined) {
                    context.updateContext({
                      ...context.state,
                      template: { ...context.state.template, subtasks: filteredSubtasks },
                      deletedSubtaskIds: [...context.state.deletedSubtaskIds ?? [], subtasks[index].id]
                    })
                  } else {
                    onChange(filteredSubtasks)
                    deleteSubtaskMutation.mutate(subtask.id)
                  }
                }}
                onDoneChange={done => {
                  // taskTemplateId === "" for the creation of a template
                  if (taskTemplateId !== undefined) {
                    return
                  }
                  if (!isCreatingTask) {
                    if (done) {
                      setSubtaskToDoneMutation.mutate(subtask.id)
                    } else {
                      setSubtaskToToDoMutation.mutate(subtask.id)
                    }
                  }
                  subtask.isDone = done
                }}
              />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}
