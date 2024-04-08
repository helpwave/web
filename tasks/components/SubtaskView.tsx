import { useContext, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Plus } from 'lucide-react'
import { tw } from '@helpwave/common/twind'
import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import { Button } from '@helpwave/common/components/Button'
import { Span } from '@helpwave/common/components/Span'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { noop } from '@helpwave/common/util/noop'
import { SubtaskTile } from './SubtaskTile'
import { TaskTemplateContext } from '@/pages/templates'
import type { Task } from '@/mutations/task_mutations'
import {
  emptyTask,
  useTaskCreateMutation,
  useTaskDeleteMutation,
  useTaskUpdateMutation
} from '@/mutations/task_mutations'
import type { TaskTemplate } from '@/mutations/task_template_mutations'

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

type SubtaskViewProps = PropsForTranslation<SubtaskViewTranslation, {
  subtasks: Task[],
  onChange?: (subtasks: Task[]) => void,
  onUpdate?: (subTask: Task) => void,
  onAdd?: (subTask: Task) => void,
  onRemove?: (subTask: Task, index: number) => void
}>

/**
 * A view for editing and showing all subtasks of a task
 */
// TODO differentiate Templates and Tasks
export const SubtaskView = ({
  overwriteTranslation,
  subtasks,
  onChange = noop,
  onUpdate = noop,
  onRemove = noop,
  onAdd = noop,
}: SubtaskViewProps) => {
  const translation = useTranslation(defaultSubtaskViewTranslation, overwriteTranslation)
  const scrollableRef = useRef<Scrollbars>(null)
  const [scrollToBottomFlag, setScrollToBottom] = useState(false)

  // Automatic scrolling to the last element to give the user a visual feedback
  useEffect(() => {
    if (scrollableRef.current && scrollToBottomFlag) {
      scrollableRef.current.scrollToBottom()
    }
    setScrollToBottom(false)
  }, [scrollToBottomFlag, subtasks])

  const removeSubtask = (subtask: Task, index: number) => {
    const filteredSubtasks = subtasks.filter((_, subtaskIndex) => subtaskIndex !== index)
    onChange(filteredSubtasks)
    onRemove(subtask, index)
  }

  const changeSubtaskState = (subtask: Task, done: boolean, previousState: TaskStatus) => {
    subtask.status = done ? TaskStatus.TASK_STATUS_DONE :
        (previousState === TaskStatus.TASK_STATUS_DONE ? TaskStatus.TASK_STATUS_IN_PROGRESS : TaskStatus.TASK_STATUS_TODO)
    onChange(subtasks)
    onUpdate(subtask)
  }

  return (
    <div className={tw('flex flex-col gap-y-2')}>
      <div className={tw('flex flex-row items-center justify-between')}>
        <Span type="subsectionTitle">{translation.subtasks}</Span>
        <Button
          onClick={() => {
            const newSubtask: Task = { ...emptyTask, name: `${translation.newSubtask} ${subtasks.length + 1}` }
            onChange([...subtasks, newSubtask])
            onAdd(newSubtask)
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
                  onUpdate(newSubtask)
                }}
                onNameEditCompleted={newSubtask => {
                  onChange(subtasks)
                  onUpdate(newSubtask)
                }}
                onRemoveClick={() => removeSubtask(subtask, index)}
                onDoneChange={(done) => changeSubtaskState(subtask, done, subtask.status)}
              />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}

export type SubtaskViewTasksProps = SubtaskViewProps & {
  taskId?: string,
  patientId: string
}
export const SubtaskViewTasks = ({
  subtasks,
  taskId,
  patientId,
  onChange = noop,
  onAdd = noop,
  onRemove = noop,
  onUpdate = noop,
  overwriteTranslation
}: SubtaskViewTasksProps) => {
  const isCreating = taskId === undefined

  const addSubtaskMutation = useTaskCreateMutation(patientId)
  const deleteSubtaskMutation = useTaskDeleteMutation()
  const updateSubtaskMutation = useTaskUpdateMutation()
  return (
    <SubtaskView
      subtasks={subtasks}
      onChange={onChange}
      onAdd={subTask => {
        subTask.parentId = taskId
        if (!isCreating) {
          addSubtaskMutation.mutate(subTask)
        }
        onAdd(subTask)
      }}
      onRemove={(subTask, index) => {
        if (!isCreating) {
          deleteSubtaskMutation.mutate(subTask.id)
        }
        onRemove(subTask, index)
      }}
      onUpdate={subTask => {
        if (!isCreating) {
          updateSubtaskMutation.mutate(subTask)
        }
        onUpdate(subTask)
      }}
      overwriteTranslation={overwriteTranslation}
    />
  )
}

export type SubtaskViewTemplatesProps = Omit<SubtaskViewProps, 'subtasks'> & {
  templateId?: string,
  subtasks: TaskTemplate[]
}
export const SubtaskViewTemplates = ({
  subtasks,
  onChange,
  onAdd,
  onUpdate,
  onRemove = noop,
  overwriteTranslation
}: SubtaskViewTemplatesProps) => {
  const context = useContext(TaskTemplateContext)

  return (
    <SubtaskView
      subtasks={subtasks} // TODO cast this or use a different component
      onChange={onChange}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onRemove={(subTask, index) => {
        const filteredSubtasks = subtasks.filter((value, index1) => index1 !== index)
        context.updateContext({
          ...context.state,
          template: { ...context.state.template, subtasks: filteredSubtasks },
          // index access is safe as the index comes from mapping over the subtasks
          deletedSubtaskIds: [...context.state.deletedSubtaskIds ?? [], subtasks[index]!.id]
        })
        onRemove(subTask, index)
      }}
      overwriteTranslation={overwriteTranslation}
    />
  )
}
