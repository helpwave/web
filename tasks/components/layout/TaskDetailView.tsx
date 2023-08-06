import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import { Select } from '@helpwave/common/components/user_input/Select'
import { TaskStatusSelect } from '../user_input/TaskStatusSelect'
import { Button } from '@helpwave/common/components/Button'
import { SubtaskView } from '../SubtaskView'
import { X } from 'lucide-react'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import { Span } from '@helpwave/common/components/Span'
import { TaskTemplateListColumn } from '../TaskTemplateListColumn'
import { Input } from '@helpwave/common/components/user_input/Input'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { TaskTemplateDTO } from '../../mutations/task_template_mutations'
import {
  usePersonalTaskTemplateQuery,
  useWardTaskTemplateQuery
} from '../../mutations/task_template_mutations'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import type { TaskDTO } from '../../mutations/task_mutations'
import {
  emptyTask,
  useSubTaskAddMutation,
  useTaskCreateMutation, useTaskDeleteMutation,
  useTaskQuery,
  useTaskUpdateMutation
} from '../../mutations/task_mutations'
import { useEffect, useState } from 'react'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { tx } from '@twind/core'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'

type TaskDetailViewTranslation = {
  close: string,
  notes: string,
  subtasks: string,
  assignee: string,
  dueDate: string,
  status: string,
  visibility: string,
  creationTime: string,
  private: string,
  public: string,
  create: string,
  update: string,
  delete: string
}

const defaultTaskDetailViewTranslation: Record<Languages, TaskDetailViewTranslation> = {
  en: {
    close: 'Close',
    notes: 'Notes',
    subtasks: 'Subtasks',
    assignee: 'Assignee',
    dueDate: 'Due-Date',
    status: 'Status',
    visibility: 'Visibility',
    creationTime: 'Creation Time',
    private: 'private',
    public: 'public',
    create: 'Create',
    update: 'Update',
    delete: 'Delete'
  },
  de: {
    close: 'Schließen',
    notes: 'Notizen',
    subtasks: 'Unteraufgaben',
    assignee: 'Verantwortlich',
    dueDate: 'Fälligkeitsdatum',
    status: 'Status',
    visibility: 'Sichtbarkeit',
    creationTime: 'Erstell Zeit',
    private: 'privat',
    public: 'öffentlich',
    create: 'Hinzufügen',
    update: 'Ändern',
    delete: 'Löschen'
  }
}

export type TaskDetailViewProps = {
  taskID: string,
  patientID: string,
  onClose: () => void
}

/**
 * The view for changing or creating a task and it's information
 */
export const TaskDetailView = ({
  language,
  patientID,
  taskID,
  onClose
}: PropsWithLanguage<TaskDetailViewTranslation, TaskDetailViewProps>) => {
  const translation = useTranslation(language, defaultTaskDetailViewTranslation)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplateDTO | undefined>(undefined)
  const router = useRouter()
  const { uuid: wardId } = router.query
  const { user } = useAuth()

  const minTaskNameLength = 4
  const maxTaskNameLength = 32

  const isCreating = taskID === ''
  const { data, isLoading, isError } = useTaskQuery(taskID)

  const [task, setTask] = useState<TaskDTO>({ ...emptyTask })

  const addSubtaskMutation = useSubTaskAddMutation(() => undefined, taskID)

  const createTaskMutation = useTaskCreateMutation(newTask => {
    newTask.subtasks.forEach(value =>
      addSubtaskMutation.mutate({ ...value, taskID: newTask.id }))
    onClose()
  }, patientID)

  const updateTaskMutation = useTaskUpdateMutation()
  const deleteTaskMutation = useTaskDeleteMutation(onClose)

  useEffect(() => {
    if (data && taskID) {
      setTask(data)
    }
  }, [data, taskID])

  const {
    data: personalTaskTemplatesData,
    isLoading: personalTaskTemplatesIsLoading,
    error: personalTaskTemplatesError
  } = usePersonalTaskTemplateQuery(user?.id)
  const {
    data: wardTaskTemplatesData,
    isLoading: wardTaskTemplatesIsLoading,
    error: wardTaskTemplatesError
  } = useWardTaskTemplateQuery(wardId?.toString())

  const formatDate = (date: Date) => {
    return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const tasksDetails = (
    <div className={tx('flex flex-col', { 'pl-6': isCreating, 'px-2': !isCreating })}>
      <div className={tw('flex flex-row justify-between')}>
        <div className={tw('mr-2')}>
          <ToggleableInput
            autoFocus
            initialState="editing"
            id="name"
            value={task.name}
            onChange={name => setTask({ ...task, name })}
            labelClassName={tw('text-2xl font-bold')}
            minLength={minTaskNameLength}
            maxLength={maxTaskNameLength}
            size={24}
          />
        </div>
        <button className={tw('flex flex-row gap-x-2')} onClick={onClose}>
          <Span>{translation.close}</Span>
          <X/>
        </button>
      </div>
      <div className={tw('flex flex-row flex-1 gap-x-8 mt-3')}>
        <div className={tw('flex flex-col gap-y-8 w-[60%] min-w-[500px]')}>
          <div className={tw('min-h-[25%]')}>
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChange={description => setTask({ ...task, notes: description })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} taskID={taskID} onChange= {subtasks => {
            setTask({ ...task, subtasks })
          }}/>
        </div>
        { /* TODO create a new component for this */}
        <div className={tw('flex flex-col justify-between min-w-[250px]')}>
          <div className={tw('flex flex-col gap-y-4 hidden')}>
            <div>
              <label><Span type="labelMedium">{translation.assignee}</Span></label>
              <Select
                value={task.assignee}
                options={[
                  { label: 'Assignee 1', value: 'assignee1' },
                  { label: 'Assignee 2', value: 'assignee2' },
                  { label: 'Assignee 3', value: 'assignee3' },
                  { label: 'Assignee 4', value: 'assignee4' }
                ]}
                onChange={assignee => {
                  setTask({ ...task, assignee })
                }}
              />
            </div>
            <div>
              <label><Span type="labelMedium">{translation.dueDate}</Span></label>
              <Input
                value={formatDate(task.dueDate)}
                type="datetime-local"
                onChange={value => {
                  const dueDate = new Date(value)
                  setTask({ ...task, dueDate })
                }}
              />
            </div>
            <div>
              <label><Span type="labelMedium">{translation.status}</Span></label>
              <TaskStatusSelect value={task.status} onChange={status => setTask({ ...task, status })}/>
            </div>
            <div>
              <label><Span type="labelMedium">{translation.visibility}</Span></label>
              <Select
                value={task.isPublicVisible}
                options={[
                  { label: translation.private, value: false },
                  { label: translation.public, value: true }
                ]}
                onChange={isPublicVisible => setTask({ ...task, isPublicVisible })}
              />
            </div>
            {task.creationDate && (
              <div className={tw('flex flex-col gap-y-1')}>
                <Span type="labelMedium">{translation.creationTime}</Span>
                <TimeDisplay date={new Date(task.creationDate)}/>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={tw('flex flex-row justify-end gap-x-8')}>
        {!isCreating ? (
            <>
              <Button color="negative" onClick={() => deleteTaskMutation.mutate(task.id)}>{translation.delete}</Button>
              <Button color="accent" onClick={() => updateTaskMutation.mutate(task)}>{translation.update}</Button>
            </>
        )
          : <Button color="accent" onClick={() => createTaskMutation.mutate(task)}>{translation.create}</Button>
        }
      </div>
    </div>
  )

  const templateSidebar = (
    <div
        className={tw('fixed flex flex-col w-[250px] -translate-x-[250px] -translate-y-4 overflow-hidden p-4 pb-0 bg-gray-100 rounded-l-xl h-full')}
    >
      {personalTaskTemplatesData && wardTaskTemplatesData && (
        <TaskTemplateListColumn
          taskTemplates={[...(personalTaskTemplatesData.map(taskTemplate => ({
            taskTemplate,
            type: 'personal' as const
          }))),
          ...(wardTaskTemplatesData.map(taskTemplate => ({ taskTemplate, type: 'ward' as const })))]
            .sort((a, b) => a.taskTemplate.name.localeCompare(b.taskTemplate.name))}
          selectedID={selectedTemplate?.id ?? ''}
          onTileClick={(taskTemplate) => {
            setSelectedTemplate(taskTemplate)
            setTask({
              ...task,
              name: taskTemplate.name,
              notes: taskTemplate.notes,
              subtasks: taskTemplate.subtasks
            })
          }}
          onColumnEditClick={() => router.push(`/ward/${wardId}/templates`)}
        />
      )}
      <>
        {((personalTaskTemplatesIsLoading || wardTaskTemplatesIsLoading) || (personalTaskTemplatesError || wardTaskTemplatesError)) && <LoadingAnimation />}
      </>
  </div>
  )

  return (
    <LoadingAndErrorComponent
      isLoading={(isLoading || !data) && !isCreating}
      hasError={isError}
      loadingProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
      errorProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
    >
      <div className={tx('relative flex flex-row')}>
        {isCreating && templateSidebar}
        {tasksDetails}
      </div>
    </LoadingAndErrorComponent>
  )
}
