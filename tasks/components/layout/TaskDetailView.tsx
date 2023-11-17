import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw, tx } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user_input/ToggleableInput'
import { Textarea } from '@helpwave/common/components/user_input/Textarea'
import { TaskStatusSelect } from '../user_input/TaskStatusSelect'
import { TaskVisibilitySelect } from '../user_input/TaskVisibilitySelect'
import { Button } from '@helpwave/common/components/Button'
import { SubtaskView } from '../SubtaskView'
import { X } from 'lucide-react'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import { Span } from '@helpwave/common/components/Span'
import { TaskTemplateListColumn } from '../TaskTemplateListColumn'
import { Input } from '@helpwave/common/components/user_input/Input'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { TaskTemplateDTO } from '../../mutations/task_template_mutations'
import { usePersonalTaskTemplateQuery, useWardTaskTemplateQuery } from '../../mutations/task_template_mutations'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import type { TaskDTO } from '../../mutations/task_mutations'
import {
  emptyTask, useAssignTaskToUserMutation,
  useSubTaskAddMutation,
  useTaskCreateMutation,
  useTaskDeleteMutation,
  useTaskQuery,
  useTaskToDoneMutation,
  useTaskToInProgressMutation,
  useTaskToToDoMutation,
  useTaskUpdateMutation, useUnassignTaskToUserMutation
} from '../../mutations/task_mutations'
import { useEffect, useState } from 'react'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { AssigneeSelect } from '../AssigneeSelect'
import { useWardQuery } from '../../mutations/ward_mutations'
import { ModalHeader } from '@helpwave/common/components/modals/Modal'

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
  delete: string,
  publish: string,
  publishTask: string,
  publishTaskDescription: string,
  finish: string
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
    delete: 'Delete',
    publish: 'Publish',
    publishTask: 'Publish Task',
    publishTaskDescription: 'This cannot be undone',
    finish: 'Finish Task',
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
    delete: 'Löschen',
    publish: 'Veröffentlichen',
    publishTask: 'Task Veröffentlichen',
    publishTaskDescription: 'Diese Handlung kann nicht rückgängig gemacht werden',
    finish: 'Fertigstellen',
  }
}

export type TaskDetailViewProps = {
  /**
   * A not set or empty taskId is seen as creating a new task
   */
  taskId?: string,
  patientId: string,
  onClose: () => void,
  initialStatus?: TaskStatus
}

/**
 * The view for changing or creating a task and it's information
 */
export const TaskDetailView = ({
  language,
  patientId,
  taskId = '',
  initialStatus,
  onClose
}: PropsWithLanguage<TaskDetailViewTranslation, TaskDetailViewProps>) => {
  const translation = useTranslation(language, defaultTaskDetailViewTranslation)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplateDTO | undefined>(undefined)
  const router = useRouter()
  const { id: wardId } = router.query
  const { user } = useAuth()
  const [isShowingPublicDialog, setIsShowingPublicDialog] = useState(false)
  const { data: ward } = useWardQuery(wardId as string)

  const minTaskNameLength = 4
  const maxTaskNameLength = 32

  const isCreating = taskId === ''
  const {
    data,
    isLoading,
    isError
  } = useTaskQuery(taskId)

  const [task, setTask] = useState<TaskDTO>({
    ...emptyTask,
    status: initialStatus ?? TaskStatus.TASK_STATUS_TODO
  })

  const addSubtaskMutation = useSubTaskAddMutation(taskId)

  const assignTaskToUserMutation = useAssignTaskToUserMutation()
  const unassignTaskToUserMutation = useUnassignTaskToUserMutation()
  const updateTaskMutation = useTaskUpdateMutation()
  const deleteTaskMutation = useTaskDeleteMutation(onClose)
  const toToDoMutation = useTaskToToDoMutation()
  const toInProgressMutation = useTaskToInProgressMutation()
  const toDoneMutation = useTaskToDoneMutation()

  const createTaskMutation = useTaskCreateMutation(newTask => {
    newTask.subtasks.forEach(value =>
      addSubtaskMutation.mutate({
        ...value,
        taskId: newTask.id
      }))
    if (newTask.assignee) {
      assignTaskToUserMutation.mutate({
        taskId: newTask.id,
        userId: newTask.assignee
      })
    }
    onClose()
  }, patientId)

  useEffect(() => {
    if (data && taskId) {
      setTask(data)
    }
  }, [data, taskId])

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

  const taskNameMinimumLength = 1
  const isValid = task.name.length >= taskNameMinimumLength

  const updateLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  const tasksDetails = (
    <div className={tx('flex flex-col', {
      'pl-6': isCreating,
      'px-2': !isCreating
    })}>
      <ConfirmDialog
        id="TaskDetailView-PublishDialog"
        isOpen={isShowingPublicDialog}
        onBackgroundClick={() => setIsShowingPublicDialog(false)}
        onCancel={() => setIsShowingPublicDialog(false)}
        onCloseClick={() => setIsShowingPublicDialog(false)}
        onConfirm={() => {
          setIsShowingPublicDialog(false)
          const newTask = {
            ...task,
            isPublicVisible: true
          }
          setTask(newTask)
          updateLocallyAndExternally(newTask)
        }}
        titleText={translation.publishTask}
        descriptionText={translation.publishTaskDescription}
      />
      <ModalHeader
        title={(
          <ToggleableInput
            autoFocus={isCreating}
            initialState="editing"
            id="name"
            value={task.name}
            onChange={name => setTask({
              ...task,
              name
            })}
            onEditCompleted={text => updateLocallyAndExternally({
              ...task,
              name: text
            })}
            labelClassName={tw('text-2xl font-bold')}
            minLength={minTaskNameLength}
            maxLength={maxTaskNameLength}
            size={24}
          />
        )}
        onCloseClick={onClose}
      />
      <div className={tw('flex flex-row flex-1 gap-x-8 mt-3')}>
        <div className={tw('flex flex-col gap-y-8 w-[60%] min-w-[500px]')}>
          <div className={tw('min-h-[25%]')}>
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChange={description => setTask({
                ...task,
                notes: description
              })}
              onEditCompleted={text => updateLocallyAndExternally({
                ...task,
                notes: text
              })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} taskId={taskId} onChange={subtasks => {
            setTask({
              ...task,
              subtasks
            })
          }} />
        </div>
        { /* TODO create a new component for this */}
        <div className={tw('flex flex-col min-w-[250px] gap-y-4')}>
          <div>
            <label><Span type="labelMedium">{translation.assignee}</Span></label>
            <div className={tw('flex flex-row items-center gap-x-2')}>
              <AssigneeSelect
                organizationId={ward?.organizationId ?? ''}
                value={task.assignee}
                onChange={assignee => {
                  setTask({
                    ...task,
                    assignee
                  })
                  if (!isCreating) {
                    assignTaskToUserMutation.mutate({
                      taskId: task.id,
                      userId: assignee
                    })
                  }
                }}
              />
              <Button
                onClick={() => {
                  setTask({
                    ...task,
                    assignee: ''
                  })
                  if (!isCreating) {
                    unassignTaskToUserMutation.mutate(task.id)
                  }
                }}
                variant="textButton"
                color="negative"
                disabled={!task.assignee}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
          <div>
            <label><Span type="labelMedium">{translation.dueDate}</Span></label>
            <div className={tw('flex flex-row items-center gap-x-2')}>
              <Input
                value={task.dueDate ? formatDate(task.dueDate) : ''}
                type="datetime-local"
                onChangeEvent={event => {
                  if (!event.target.value) {
                    event.preventDefault()
                    return
                  }
                  const dueDate = new Date(event.target.value)
                  updateLocallyAndExternally({
                    ...task,
                    dueDate
                  })
                }}
              />
              { /* TODO reenable when backend has implemented a remove duedate
                  <Button
                    onClick={() => setTask({ ...task, dueDate: undefined })}
                    variant="textButton"
                    color="negative"
                    disabled={!task.dueDate}
                  >
                    <X size={24}/>
                  </Button>
                  */}
            </div>
          </div>
          <div>
            <label><Span type="labelMedium">{translation.status}</Span></label>
            <TaskStatusSelect
              value={task.status}
              removeOptions={isCreating ? [TaskStatus.TASK_STATUS_DONE] : []}
              onChange={status => {
                if (!isCreating) {
                  switch (status) {
                    case TaskStatus.TASK_STATUS_TODO:
                      toToDoMutation.mutate(task.id)
                      break
                    case TaskStatus.TASK_STATUS_IN_PROGRESS:
                      toInProgressMutation.mutate(task.id)
                      break
                    case TaskStatus.TASK_STATUS_DONE:
                      toDoneMutation.mutate(task.id)
                      break
                    default:
                      break
                  }
                }
                setTask({
                  ...task,
                  status
                })
              }}
            />
          </div>
          <div className={tw('select-none')}>
            <label><Span type="labelMedium">{translation.visibility}</Span></label>
            {!isCreating ? (
              <div className={tw('flex flex-row justify-between items-center')}>
                <Span>{task.isPublicVisible ? translation.public : translation.private}</Span>
                {!task.isPublicVisible && !isCreating && (
                  <Button
                    color="neutral"
                    variant="tertiary"
                    className={tw('!py-1 !px-2')}
                    onClick={() => setIsShowingPublicDialog(true)}
                  >
                    <Span>{translation.publish}</Span>
                  </Button>
                )}
              </div>
            ) : <></>}
            {isCreating && (
              <TaskVisibilitySelect
                value={task.isPublicVisible}
                onChange={() => {
                  setTask({
                    ...task,
                    isPublicVisible: !task.isPublicVisible
                  })
                }}
              />
            )}
          </div>
          {task.creationDate && (
            <div className={tw('flex flex-col gap-y-1')}>
              <Span type="labelMedium">{translation.creationTime}</Span>
              <TimeDisplay date={new Date(task.creationDate)} />
            </div>
          )}
        </div>
      </div>
      <div className={tw('flex flex-row justify-end gap-x-8')}>
        {!isCreating ?
            (
            <>
              <Button
                color="negative"
                onClick={() => deleteTaskMutation.mutate(task.id)}
              >
                {translation.delete}
              </Button>
              {task.status !== TaskStatus.TASK_STATUS_DONE && (
                <Button
                  color="positive"
                  onClick={() => {
                    toDoneMutation.mutate(task.id)
                    onClose()
                  }}
                >
                  {translation.finish}
                </Button>
              )}
              <Button
                color="accent"
                onClick={() => updateTaskMutation.mutate(task)}
                disabled={!isValid}
              >
                {translation.update}
              </Button>
            </>
            )
          :
            (
            <Button
              color="accent"
              onClick={() => createTaskMutation.mutate(task)}
              disabled={!isValid}
            >
              {translation.create}
            </Button>
            )
        }
      </div>
    </div >
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
          ...(wardTaskTemplatesData.map(taskTemplate => ({
            taskTemplate,
            type: 'ward' as const
          })))]
            .sort((a, b) => a.taskTemplate.name.localeCompare(b.taskTemplate.name))}
          selectedId={selectedTemplate?.id ?? ''}
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
        {((personalTaskTemplatesIsLoading || wardTaskTemplatesIsLoading) || (personalTaskTemplatesError || wardTaskTemplatesError)) &&
          <LoadingAnimation />}
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
