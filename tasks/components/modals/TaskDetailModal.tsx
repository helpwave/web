import type { OverlayHeaderProps, Translation } from '@helpwave/hightide'
import {
  ConfirmModal,
  Input,
  LoadingAndErrorComponent,
  LoadingAnimation,
  Modal,
  type ModalProps,
  type PropsForTranslation,
  SolidButton,
  Textarea,
  TextButton,
  TimeDisplay,
  ToggleableInput,
  useTranslation
} from '@helpwave/hightide'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import {
  usePersonalTaskTemplateQuery,
  useWardTaskTemplateQuery
} from '@helpwave/api-services/mutations/tasks/task_template_mutations'
import {
  useAssignTaskMutation,
  useTaskCreateMutation,
  useTaskDeleteMutation,
  useTaskQuery,
  useTaskUpdateMutation,
  useUnassignTaskMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import type { TaskTemplateDTO } from '@helpwave/api-services/types/tasks/tasks_templates'
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

const defaultTaskDetailViewTranslation: Translation<TaskDetailViewTranslation> = {
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


function formatDateForDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // Months are zero-indexed
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

type TaskDetailViewSidebarProps = {
  task: TaskDTO,
  onChange: (task: TaskDTO) => void,
  isCreating: boolean,
}

const TaskDetailViewSidebar = ({
                                 overwriteTranslation,
                                 task,
                                 onChange,
                                 isCreating
                               }: PropsForTranslation<TaskDetailViewTranslation, TaskDetailViewSidebarProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)

  const [isShowingPublicDialog, setIsShowingPublicDialog] = useState(false)
  const { organization } = useAuth()

  const updateTaskMutation = useTaskUpdateMutation()

  const assignTaskToUserMutation = useAssignTaskMutation()
  const unassignTaskToUserMutation = useUnassignTaskMutation()

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    onChange(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  return (
    <div className="col min-w-[250px] gap-y-4">
      <ConfirmModal
        isOpen={isShowingPublicDialog}
        onCancel={() => setIsShowingPublicDialog(false)}
        onConfirm={() => {
          setIsShowingPublicDialog(false)
          const newTask = {
            ...task,
            isPublicVisible: true
          }
          onChange(newTask)
          updateTaskLocallyAndExternally(newTask)
        }}
        headerProps={{
          titleText: translation.publishTask,
          descriptionText: translation.publishTaskDescription,
        }}
      />
      <div>
        <label className="textstyle-label-md">{translation.assignee}</label>
        <div className="row items-center gap-x-2">
          <AssigneeSelect
            organizationId={organization?.id ?? ''}
            value={task.assignee}
            onChange={(assignee) => {
              onChange({ ...task, assignee })
              if (!isCreating) {
                assignTaskToUserMutation.mutate({ taskId: task.id, userId: assignee })
              }
            }}
          />
          <TextButton
            onClick={() => {
              onChange({ ...task, assignee: undefined })
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
            value={task.dueDate ? formatDateForDatetimeLocal(task.dueDate) : ''}
            type="datetime-local"
            onChangeText={(text) => {
              const dueDate = new Date(text)
              updateTaskLocallyAndExternally({
                ...task,
                dueDate
              })
            }}
            className="w-full"
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
            onChange(newTask)
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
              onChange({ ...task, isPublicVisible: !task.isPublicVisible })
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

export type TaskDetailModalProps = Omit<ModalProps, keyof OverlayHeaderProps> & {
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
 * A Modal Wrapper for the task detail view
 */
export const TaskDetailModal = ({
                                  overwriteTranslation,
                                  patientId,
                                  taskId = '',
                                  wardId,
                                  initialStatus,
                                  onClose,
                                  className,
                                  ...modalProps
                                }: PropsForTranslation<TaskDetailViewTranslation, TaskDetailModalProps>) => {
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

  const deleteTaskMutation = useTaskDeleteMutation()
  const updateTaskMutation = useTaskUpdateMutation()
  const createTaskMutation = useTaskCreateMutation(() => {
    onClose()
  }, patientId)

  useEffect(() => {
    if (data && taskId) {
      setTask(data)
    }
  }, [data, taskId])

  console.log(task)

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
    <div className="row justify-end gap-x-4">
      {!isCreating ?
        (
          <>
            <SolidButton
              color="negative"
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
        ) : (
          <SolidButton onClick={() => createTaskMutation.mutate(task)} disabled={!isValid}>
            {translation.create}
          </SolidButton>
        )
      }
    </div>
  )

  const tasksDetails = (
    <div className={clsx('col')}>
      <div className="row justify-between gap-x-8 mt-3">
        <div className="col grow gap-y-8 min-w-[300px]">
          <div className="min-h-[25%]">
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChangeText={(description) => setTask({ ...task, notes: description })}
              onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, notes: text })}
            />
          </div>
          <SubtaskView subtasks={task.subtasks} taskId={taskId} onChange={(subtasks) => setTask({ ...task, subtasks })}/>
        </div>
        <TaskDetailViewSidebar task={task} onChange={setTask} isCreating={isCreating}/>
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
      className="absolute left-[-250px] top-0 col w-[250px] overflow-hidden p-4 pb-0 bg-gray-100 rounded-l-xl h-full"
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
      <ConfirmModal
        isOpen={isShowingDeleteDialog}
        headerProps={{
          titleText: `${translation.deleteTask}?`,
          descriptionText: `${translation.deleteTaskDescription}`
        }}
        onConfirm={() => {
          deleteTaskMutation.mutate(task.id)
          setIsShowingDeleteDialog(false)
          onClose()
        }}
        onCancel={() => setIsShowingDeleteDialog(false)}
        buttonOverwrites={[{}, {}, { color: 'negative' }]}
      />
      <Modal
        className={clsx('relative gap-y-0 max-w-[800px] w-[calc(100vw-532px)]', {
          'rounded-l-none': isCreating,
        }, className)}
        headerProps={{
          title: (
            <ToggleableInput
              autoFocus={isCreating}
              initialState="editing"
              id="name"
              value={task.name}
              onChangeText={(name) => setTask({ ...task, name })}
              onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, name: text })}
              labelClassName="text-2xl font-bold"
              minLength={minTaskNameLength}
              maxLength={maxTaskNameLength}
              size={20}
            />
          )
        }}
        onClose={onClose}
        {...modalProps}
      >
        {isCreating && templateSidebar}
        <LoadingAndErrorComponent
          isLoading={(isLoading || !data) && !isCreating}
          hasError={isError}
          loadingProps={{ classname: 'min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]' }}
          errorProps={{ classname: 'min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]' }}
        >
          {tasksDetails}
        </LoadingAndErrorComponent>
      </Modal>
    </>
  )
}
