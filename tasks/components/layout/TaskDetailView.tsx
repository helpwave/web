import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw, tx } from '@helpwave/common/twind'
import { ToggleableInput } from '@helpwave/common/components/user-input/ToggleableInput'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import { Button } from '@helpwave/common/components/Button'
import { X } from 'lucide-react'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user-input/Input'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { ModalHeader } from '@helpwave/common/components/modals/Modal'
import { formatDateTime } from '@helpwave/common/util/date'
import { TaskTemplateListColumn } from '../TaskTemplateListColumn'
import { SubtaskView } from '../SubtaskView'
import { TaskVisibilitySelect } from '@/components/selects/TaskVisibilitySelect'
import { TaskStatusSelect } from '@/components/selects/TaskStatusSelect'
import {
  usePersonalTaskTemplateQuery,
  useWardTaskTemplateQuery,
  type TaskTemplateDTO
} from '@/mutations/task_template_mutations'
import { useAuth } from '@/hooks/useAuth'
import {
  useAssignTaskToUserMutation,
  useSubTaskAddMutation,
  useTaskCreateMutation,
  useTaskDeleteMutation,
  useTaskQuery,
  useTaskToDoneMutation,
  useTaskToInProgressMutation,
  useTaskToToDoMutation,
  useTaskUpdateMutation,
  useUnassignTaskToUserMutation
} from '@/mutations/task_mutations'
import { type WardWithOrganizationIdDTO, useWardQuery } from '@/mutations/ward_mutations'
import { AssigneeSelect } from '@/components/selects/AssigneeSelect'
import type { TaskDTO, TaskStatus } from '@/mutations/types/task'
import { emptyTask } from '@/mutations/types/task'

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
  delete: string,
  deleteTask: string,
  deleteTaskDescription: string,
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
    dueDate: 'Due date',
    status: 'Status',
    visibility: 'Visibility',
    creationTime: 'Creation time',
    private: 'private',
    public: 'public',
    create: 'Create',
    delete: 'Delete',
    deleteTask: 'Delete Task',
    deleteTaskDescription: 'The Tasks will be irrevocably removed',
    publish: 'Publish',
    publishTask: 'Publish task',
    publishTaskDescription: 'This cannot be undone',
    finish: 'Finish task',
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
    delete: 'Löschen',
    deleteTask: 'Task löschen',
    deleteTaskDescription: 'Der Tasks wird unwiederruflich gelöscht',
    publish: 'Veröffentlichen',
    publishTask: 'Task Veröffentlichen',
    publishTaskDescription: 'Diese Handlung kann nicht rückgängig gemacht werden',
    finish: 'Fertigstellen',
  }
}

type TaskDetailViewSidebarProps = {
  task: TaskDTO,
  setTask: (task: TaskDTO) => void,
  // TODO: get rid of the undefined; rather extract all error and loading states and have the confidence that things aren't undefined anymore
  ward: WardWithOrganizationIdDTO | undefined,
  isCreating: boolean
}

const TaskDetailViewSidebar = ({
  overwriteTranslation,
  task,
  setTask,
  ward,
  isCreating
}: PropsForTranslation<TaskDetailViewTranslation, TaskDetailViewSidebarProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)

  const [isShowingPublicDialog, setIsShowingPublicDialog] = useState(false)

  const updateTaskMutation = useTaskUpdateMutation()

  const assignTaskToUserMutation = useAssignTaskToUserMutation()
  const unassignTaskToUserMutation = useUnassignTaskToUserMutation()

  const toToDoMutation = useTaskToToDoMutation()
  const toInProgressMutation = useTaskToInProgressMutation()
  const toDoneMutation = useTaskToDoneMutation()

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  return (
    <div className={tw('flex flex-col min-w-[250px] gap-y-4')}>
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
          updateTaskLocallyAndExternally(newTask)
        }}
        titleText={translation.publishTask}
        descriptionText={translation.publishTaskDescription}
      />
      <div>
        <label><Span type="labelMedium">{translation.assignee}</Span></label>
        <div className={tw('flex flex-row items-center gap-x-2')}>
          <AssigneeSelect
            organizationId={ward?.organizationId ?? ''}
            value={task.assignee}
            onChange={(assignee) => {
              setTask({ ...task, assignee })
              if (!isCreating) {
                assignTaskToUserMutation.mutate({ taskId: task.id, userId: assignee })
              }
            }}
          />
          <Button
            onClick={() => {
              setTask({ ...task, assignee: '' }) // TODO: why are we using empty strings instead of undefined?
              if (!isCreating) {
                unassignTaskToUserMutation.mutate(task.id)
              }
            }}
            variant="textButton"
            color="negative"
            disabled={!task.assignee}
          >
            <X size={24}/>
          </Button>
        </div>
      </div>
      <div>
        <label><Span type="labelMedium">{translation.dueDate}</Span></label>
        <div className={tw('flex flex-row items-center gap-x-2')}>
          <Input
            value={task.dueDate ? formatDateTime(task.dueDate) : ''}
            type="datetime-local"
            onChange={(value, event) => {
              if (!event.target.value) {
                event.preventDefault()
                return
              }
              const dueDate = new Date(value)
              updateTaskLocallyAndExternally({
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
          removeOptions={isCreating ? ['done'] : []}
          onChange={(status) => {
            if (!isCreating) {
              switch (status) {
                case 'todo':
                  toToDoMutation.mutate(task.id)
                  break
                case 'inProgress':
                  toInProgressMutation.mutate(task.id)
                  break
                case 'done':
                  toDoneMutation.mutate(task.id)
                  break
                default:
                  break
              }
            }
            setTask({ ...task, status })
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
        ) : null}
        {isCreating && (
          <TaskVisibilitySelect
            value={task.isPublicVisible}
            onChange={() => {
              setTask({ ...task, isPublicVisible: !task.isPublicVisible })
            }}
          />
        )}
      </div>
      {task.creationDate && (
        <div className={tw('flex flex-col gap-y-1')}>
          <Span type="labelMedium">{translation.creationTime}</Span>
          <TimeDisplay date={new Date(task.creationDate)}/>
        </div>
      )}
    </div>
  )
}

export type TaskDetailViewProps = {
  /**
   * A not set or empty taskId is seen as creating a new task
   */
  taskId?: string,
  wardId: string,
  patientId: string,
  onClose: () => void,
  initialStatus?: TaskStatus
}

/**
 * The view for changing or creating a task and it's information
 */
export const TaskDetailView = ({
  overwriteTranslation,
  patientId,
  taskId = '',
  wardId,
  initialStatus,
  onClose
}: PropsForTranslation<TaskDetailViewTranslation, TaskDetailViewProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)
  const [selectedTemplateId, setSelectedTemplateId] = useState<TaskTemplateDTO['id'] | undefined>(undefined)
  const [isShowingDeleteDialog, setIsShowingDeleteDialog] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const ward = useWardQuery(wardId).data

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
    status: initialStatus ?? 'todo'
  })

  const addSubtaskMutation = useSubTaskAddMutation(taskId)

  const assignTaskToUserMutation = useAssignTaskToUserMutation()
  const updateTaskMutation = useTaskUpdateMutation()
  const deleteTaskMutation = useTaskDeleteMutation(onClose)
  const toDoneMutation = useTaskToDoneMutation()

  const createTaskMutation = useTaskCreateMutation(newTask => {
    newTask.subtasks.forEach(value => addSubtaskMutation.mutate({ ...value, taskId: newTask.id }))
    if (newTask.assignee) {
      assignTaskToUserMutation.mutate({ taskId: newTask.id, userId: newTask.assignee })
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
  } = useWardTaskTemplateQuery(wardId)

  const taskNameMinimumLength = 1
  const isValid = task.name.length >= taskNameMinimumLength

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  const buttons = (
    <div className={tw('flex flex-row justify-end gap-x-8')}>
      {!isCreating ?
          (
          <>
            <Button color="negative" onClick={() => setIsShowingDeleteDialog(true)}>
              {translation.delete}
            </Button>
            {task.status !== 'done' && (
              <Button color="positive" onClick={() => {
                toDoneMutation.mutate(task.id)
                onClose()
              }}>
                {translation.finish}
              </Button>
            )}
          </>
          )
        :
          (
          <Button color="accent" onClick={() => createTaskMutation.mutate(task)} disabled={!isValid}>
            {translation.create}
          </Button>
          )
      }
    </div>
  )

  const tasksDetails = (
    <div className={tx('flex flex-col', {
      'pl-6': isCreating,
      'px-2': !isCreating
    })}>
      <ModalHeader
        title={(
          <ToggleableInput
            autoFocus={isCreating}
            initialState="editing"
            id="name"
            value={task.name}
            onChange={(name) => setTask({ ...task, name })}
            onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, name: text })}
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
              onChange={(description) => setTask({ ...task, notes: description })}
              onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, notes: text })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} taskId={taskId} onChange={(subtasks) => setTask({ ...task, subtasks })}/>
        </div>
        <TaskDetailViewSidebar task={task} setTask={setTask} ward={ward} isCreating={isCreating}/>
      </div>
      {buttons}
    </div>
  )

  const taskTemplates =
    personalTaskTemplatesData && wardTaskTemplatesData
      ? [
          ...(personalTaskTemplatesData.map((taskTemplate) => ({
            taskTemplate,
            type: 'personal' as const
          }))),
          ...(wardTaskTemplatesData.map((taskTemplate) => ({
            taskTemplate,
            type: 'ward' as const
          })))
        ].sort((a, b) => a.taskTemplate.name.localeCompare(b.taskTemplate.name))
      : []

  const templateSidebar = (
    <div
      className={tw('fixed flex flex-col w-[250px] -translate-x-[250px] -translate-y-4 overflow-hidden p-4 pb-0 bg-gray-100 rounded-l-xl h-full')}
    >
      {personalTaskTemplatesData && wardTaskTemplatesData && (
        <TaskTemplateListColumn
          templates={taskTemplates}
          activeId={selectedTemplateId}
          onTileClick={({ id, name, notes, subtasks }) => {
            setSelectedTemplateId(id)
            setTask({ ...task, name, notes, subtasks })
          }}
          onColumnEditClick={() => router.push(`/ward/${wardId}/templates`)}
        />
      )}
      {(personalTaskTemplatesIsLoading || wardTaskTemplatesIsLoading || personalTaskTemplatesError || wardTaskTemplatesError) ?
        <LoadingAnimation/> : null}
    </div>
  )

  return (
    <>
      <ConfirmDialog
        id="deleteTaskDialog"
        isOpen={isShowingDeleteDialog}
        titleText={`${translation.deleteTask}?`}
        descriptionText={`${translation.deleteTaskDescription}`}
        onConfirm={() => {
          deleteTaskMutation.mutate(task.id)
          setIsShowingDeleteDialog(false)
        }}
        onCancel={() => setIsShowingDeleteDialog(false)}
        onCloseClick={() => setIsShowingDeleteDialog(false)}
        onBackgroundClick={() => setIsShowingDeleteDialog(false)}
        buttonOverwrites={[{}, {}, { color: 'negative' }]}
      />
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
    </>
  )
}
