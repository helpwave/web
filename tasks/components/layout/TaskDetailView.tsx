import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import clsx from 'clsx'
import { ToggleableInput } from '@helpwave/hightide'
import { Textarea } from '@helpwave/hightide'
import { SolidButton, TextButton } from '@helpwave/hightide'
import { X } from 'lucide-react'
import { TimeDisplay } from '@helpwave/hightide'
import { Input } from '@helpwave/hightide'
import type { Languages } from '@helpwave/hightide'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LoadingAnimation } from '@helpwave/hightide'
import { LoadingAndErrorComponent } from '@helpwave/hightide'
import { ConfirmDialog } from '@helpwave/hightide'
import { ModalHeader } from '@helpwave/hightide'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import {
  usePersonalTaskTemplateQuery,
  useWardTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import {
  useAssignTaskMutation,
  useSubTaskAddMutation,
  useTaskCreateMutation,
  useTaskQuery,
  useTaskUpdateMutation,
  useUnassignTaskMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
import { formatDate } from '@helpwave/hightide'
import { TaskTemplateListColumn } from '../TaskTemplateListColumn'
import { SubtaskView } from '../SubtaskView'
import { TaskVisibilitySelect } from '@/components/selects/TaskVisibilitySelect'
import { TaskStatusSelect } from '@/components/selects/TaskStatusSelect'
import { AssigneeSelect } from '@/components/selects/AssigneeSelect'

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
  finish: string,
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
  isCreating: boolean,
}

const TaskDetailViewSidebar = ({
                                 overwriteTranslation,
                                 task,
                                 setTask,
                                 isCreating
                               }: PropsForTranslation<TaskDetailViewTranslation, TaskDetailViewSidebarProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)

  const [isShowingPublicDialog, setIsShowingPublicDialog] = useState(false)
  const { organization } = useAuth()

  const updateTaskMutation = useTaskUpdateMutation()

  const assignTaskToUserMutation = useAssignTaskMutation()
  const unassignTaskToUserMutation = useUnassignTaskMutation()

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  return (
    <div className="col min-w-[250px] gap-y-4">
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
        <label className="textstyle-label-md">{translation.assignee}</label>
        <div className="row items-center gap-x-2">
          <AssigneeSelect
            organizationId={organization?.id ?? ''}
            value={task.assignee}
            onChange={(assignee) => {
              setTask({ ...task, assignee })
              if (!isCreating) {
                assignTaskToUserMutation.mutate({ taskId: task.id, userId: assignee })
              }
            }}
          />
          <TextButton
            onClick={() => {
              setTask({ ...task, assignee: undefined })
              if (!isCreating && task.assignee) {
                unassignTaskToUserMutation.mutate({
                  taskId: task.id,
                  userId: task.assignee
                })
              }
            }}
            color="negative"
            disabled={!task.assignee}
          >
            <X size={24}/>
          </TextButton>
        </div>
      </div>
      <div>
        <label className="textstyle-label-md">{translation.dueDate}</label>
        <div className="row items-center gap-x-2">
          <Input
            value={task.dueDate ? formatDate(task.dueDate) : ''}
            type="datetime-local"
            onChangeEvent={(event) => {
              if (!event.target.value) {
                event.preventDefault()
                return
              }
              const dueDate = new Date(event.target.value)
              updateTaskLocallyAndExternally({
                ...task,
                dueDate
              })
            }}
          />
          { /* TODO reenable when backend has implemented a remove duedate
          <Button
            onClick={() => setTask({ ...task, dueDate: undefined })}
            variant="text"
            color="negative"
            disabled={!task.dueDate}
          >
            <X size={24}/>
          </Button>
          */}
        </div>
      </div>
      <div>
        <label className="textstyle-label-md">{translation.status}</label>
        <TaskStatusSelect
          value={task.status}
          removeOptions={isCreating ? ['done'] : []}
          onChange={(status) => {
            const newTask = { ...task, status }
            if (!isCreating) {
              updateTaskMutation.mutate(newTask)
            }
            setTask(newTask)
          }}
        />
      </div>
      <div className="select-none">
        <label className="textstyle-label-md">{translation.visibility}</label>
        {!isCreating ? (
          <div className="row justify-between items-center">
            <span>{task.isPublicVisible ? translation.public : translation.private}</span>
            {!task.isPublicVisible && !isCreating && (
              <TextButton size="small" onClick={() => setIsShowingPublicDialog(true)}>
                <span>{translation.publish}</span>
              </TextButton>
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
      {task.createdAt && (
        <div className="col gap-y-1">
          <span className="textstyle-label-md">{translation.creationTime}</span>
          <TimeDisplay date={new Date(task.createdAt)}/>
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
  initialStatus?: TaskStatus,
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

  const assignTaskToUserMutation = useAssignTaskMutation()
  const updateTaskMutation = useTaskUpdateMutation()

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
    <div className="row justify-end gap-x-8">
      {!isCreating ?
        (
          <>
            <SolidButton
              color="negative"
              disabled={true} // TODO reenable when backend allows it
              onClick={() => setIsShowingDeleteDialog(true)}
            >
              {translation.delete}
            </SolidButton>
            {task.status !== 'done' && (
              <SolidButton color="positive" onClick={() => {
                updateTaskMutation.mutate({ ...task, status: 'done' })
                onClose()
              }}>
                {translation.finish}
              </SolidButton>
            )}
          </>
        )
        :
        (
          <SolidButton onClick={() => createTaskMutation.mutate(task)} disabled={!isValid}>
            {translation.create}
          </SolidButton>
        )
      }
    </div>
  )

  const tasksDetails = (
    <div className={clsx('col', {
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
            labelClassName="text-2xl font-bold"
            minLength={minTaskNameLength}
            maxLength={maxTaskNameLength}
            size={24}
          />
        )}
        onCloseClick={onClose}
      />
      <div className="row flex-1 gap-x-8 mt-3">
        <div className="col gap-y-8 w-[60%] min-w-[500px]">
          <div className="min-h-[25%]">
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChange={(description) => setTask({ ...task, notes: description })}
              onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, notes: text })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} taskId={taskId} onChange={(subtasks) => setTask({ ...task, subtasks })}/>
        </div>
        <TaskDetailViewSidebar task={task} setTask={setTask} isCreating={isCreating}/>
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
      className="fixed col w-[250px] -translate-x-[250px] -translate-y-4 overflow-hidden p-4 pb-0 bg-gray-100 rounded-l-xl h-full"
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
          // deleteTaskMutation.mutate(task.id)
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
        loadingProps={{ classname: 'min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]' }}
        errorProps={{ classname: 'min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]' }}
      >
        <div className="relative row">
          {isCreating && templateSidebar}
          {tasksDetails}
        </div>
      </LoadingAndErrorComponent>
    </>
  )
}
