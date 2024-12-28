import { tw, tx } from '@helpwave/common/twind'
import { Modal, type ModalProps, type ModalHeaderProps, ModalHeader } from '@helpwave/common/components/modals/Modal'
import { useEffect, useState } from 'react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { noop } from '@helpwave/common/util/noop'
import { Checkbox } from '@helpwave/common/components/user-input/Checkbox'
import { formatDate } from '@helpwave/common/util/date'
import { Avatar } from '@helpwave/common/components/Avatar'
import { ArrowLeftFromLine, ArrowRightFromLine, Plus, X } from 'lucide-react'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { apply } from '@twind/core'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import {
  useAssignTaskMutation, useSubTaskAddMutation, useSubTaskUpdateMutation, useTaskCreateMutation, useTaskQuery,
  useTaskUpdateMutation,
  useUnassignTaskMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { Input } from '@helpwave/common/components/user-input/Input'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ToggleableInput } from '@helpwave/common/components/user-input/ToggleableInput'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
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
  following: string,
  previous: string,
  addTask: string
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
    following: 'Following Tasks',
    previous: 'Previous Tasks',
    addTask: 'Add Task'
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
    following: 'Nachfolgende Tasks',
    previous: 'Vorherige Tasks',
    addTask: 'Task hinzufügen'
  }
}

type SubTaskTileProps = {
  name: string,
  isDone: boolean,
  assignee?: string,
  dueDate?: Date,
  onClick?: () => void,
  onDoneClick?: (isDone: boolean) => void
}

const SubTaskTile = ({
  name,
  isDone,
  dueDate,
  assignee,
  onClick = noop,
  onDoneClick = noop,
}: SubTaskTileProps) => {
  return (
    <div className={tw('flex flex-row justify-between items-center')} onClick={onClick}>
      <div className={tw('flex flex-row gap-x-1 items-center')}>
        <Checkbox checked={isDone} color="hw-positive" className={tw('rounded-full')} onChange={onDoneClick}/>
        <span>{name}</span>
      </div>
      <div className={tw('flex flex-row gap-x-1 justify-end items-center')}>
        {dueDate && (<span className={tw('text-gray-400')}>{formatDate(dueDate)}</span>)}
        { /* TODO replace url later on */}
        {assignee ? (<Avatar avatarUrl="https://helpwave.de/favicon.ico" alt="" size="small"/>) : (
          <div
            className={tw('flex flex-row items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-400 text-gray-400')}>
            <Plus size={24}/>
          </div>
        )}
      </div>
    </div>
  )
}

type TaskRelationType = 'following' | 'previous'

type ExpandableSidebarProps = {
  tasks: TaskDTO[],
  type: TaskRelationType,
  isExpanded: boolean,
  onExpansionChange: (isExpanded: boolean) => void,
  onTaskSelected?: (task: TaskDTO) => void,
  onAddClick?: (type: TaskRelationType) => void,
  onSubtaskChange?: (task: TaskDTO) => void,
  className?: string
}

const ExpandableSidebar = ({
  tasks,
  type,
  isExpanded,
  onExpansionChange,
  onTaskSelected = noop,
  onAddClick = noop,
  onSubtaskChange = noop,
  className = '',
}: PropsForTranslation<TaskDetailViewTranslation, ExpandableSidebarProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation)

  return (
    <div className={tx(apply('flex flex-col rounded-lg justify-between p-2 pb-0'), className, {
      'cursor-pointer hover:bg-gray-100': !isExpanded
    })} onClick={() => {
      if (!isExpanded) {
        onExpansionChange(true)
      }
    }}>
      <div className={tx('flex flex-col gap-y-2', { 'items-center gap-y-3': !isExpanded })}>
        {isExpanded && (<span className={tw('font-space font-semibold text-lg')}>{type === 'following' ? translation.following : translation.previous}</span>)}
        {tasks.map(task => isExpanded ?
            (
            <SubTaskTile
              key={task.id}
              name={task.name}
              isDone={task.status === 'done'}
              assignee={task.assignee}
              dueDate={task.dueDate}
              onClick={() => onTaskSelected(task)}
              onDoneClick={isDone => onSubtaskChange({ ...task, status: isDone ? 'done' : 'todo' })}
            />
            ) :
            (
            <Checkbox key={task.id} checked={task.status === 'done'} className={tw('rounded-full')}
                      color="hw-positive"/>
            )
        )}
        {isExpanded ? (
          <button className={tw('flex flex-row gap-x-2 items-center w-full')} onClick={() => onAddClick(type)}>
            <Plus size={24}/>
            <span>{translation.addTask}</span>
          </button>
        ) : (
          <div
            className={tw('flex flex-row items-center justify-center w-[18px] h-[18px] rounded-full border-2 border-dashed border-gray-400 text-gray-400')}>
            <Plus size={18}/>
          </div>
        )}
      </div>
      <button
        className={tx('flex flex-row w-full hover:bg-gray-100 p-2 rounded-lg', { 'justify-end': type === 'previous' })}
        onClick={() => isExpanded && onExpansionChange(false)}
      >
        {((isExpanded && type === 'previous') || (!isExpanded && type === 'following')) ?
            (<ArrowLeftFromLine size={24}/>)
          : (<ArrowRightFromLine size={24}/>)
        }
      </button>
    </div>
  )
}

type InformationSectionProps = {
  task: TaskDTO,
  setTask: (task: TaskDTO) => void,
  isCreating: boolean
}

const InformationSection = ({
  overwriteTranslation,
  task,
  setTask,
  isCreating
}: PropsForTranslation<TaskDetailViewTranslation, InformationSectionProps>) => {
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
            organizationId={organization?.id ?? ''}
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
              setTask({ ...task, assignee: undefined })
              if (!isCreating && task.assignee) {
                unassignTaskToUserMutation.mutate({
                  taskId: task.id,
                  userId: task.assignee
                })
              }
            }}
            variant="text"
            color="hw-negative"
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
            color="hw-negative"
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
            const newTask = { ...task, status }
            if (!isCreating) {
              updateTaskMutation.mutate(newTask)
            }
            setTask(newTask)
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
                color="hw-neutral"
                variant="text-border"
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
      {task.createdAt && (
        <div className={tw('flex flex-col gap-y-1')}>
          <Span type="labelMedium">{translation.creationTime}</Span>
          <TimeDisplay date={new Date(task.createdAt)}/>
        </div>
      )}
    </div>
  )
}

type ExpansionState = {
  previousExpanded: boolean,
  followingExpanded: boolean
}

export type TaskDetailModalProps = Omit<ModalProps, keyof ModalHeaderProps> & {
  taskId?: string,
  patientId: string,
  initialStatus?: TaskStatus,
  onClose: () => void
}

/**
 * A Modal showing the details of a Task
 */
export const TaskDetailModal = ({
  taskId,
  patientId,
  onClose,
  initialStatus,
  modalClassName,
  overwriteTranslation,
  ...modalProps
}: PropsForTranslation<TaskDetailViewTranslation, TaskDetailModalProps>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)
  const [isShowingDeleteDialog, setIsShowingDeleteDialog] = useState(false)
  const [expansionState, setExpansionState] = useState<ExpansionState>({
    previousExpanded: false,
    followingExpanded: false
  })
  const { previousExpanded, followingExpanded } = expansionState

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
  const updateSubtask = useSubTaskUpdateMutation(taskId)

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

  const taskNameMinimumLength = 1
  const isValid = task.name.length >= taskNameMinimumLength

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  const expandedWidth = 250 // Width when expanded
  const notExpandedWidth = 56 // Width when not expanded
  const offset = ((previousExpanded ? expandedWidth : notExpandedWidth) - (followingExpanded ? expandedWidth : notExpandedWidth)) / 2

  const buttons = (
    <div className={tw('flex flex-row justify-end gap-x-8')}>
      {!isCreating ?
          (
          <>
            <Button
              color="hw-negative"
              variant="text"
              disabled={true} // TODO reenable when backend allows it
              onClick={() => setIsShowingDeleteDialog(true)}
            >
              {translation.delete}
            </Button>
            {task.status !== 'done' && (
              <Button color="hw-positive" onClick={() => updateTaskMutation.mutate({ ...task, status: 'done' })}>
                {translation.finish}
              </Button>
            )}
          </>
          )
        :
          (
          <Button onClick={() => createTaskMutation.mutate(task)} disabled={!isValid}>
            {translation.create}
          </Button>
          )
      }
    </div>
  )

  return (
    <Modal
      modalClassName={tx(`-translate-x-[calc(50%${offset >= 0 ? '+' : ''}${offset}px)]`, modalClassName)}
      {...modalProps}
    >
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
        buttonOverwrites={[{}, {}, { color: 'hw-negative' }]}
      />
      <LoadingAndErrorComponent
        isLoading={(isLoading || !data) && !isCreating}
        hasError={isError}
        loadingProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
        errorProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
      >
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
        <div className={tw('flex flex-row mt-2 gap-x-4 min-w-[600px]')}>
          <ExpandableSidebar
            // TODO change this once tasks as subtasks is implemented
            tasks={[]}
            type="previous"
            // TODO check this when Tasks as Subtasks API is merged
            onSubtaskChange={subtask => updateSubtask.mutate({ id: subtask.id, name: subtask.name, isDone: subtask.status === 'done' })}
            isExpanded={previousExpanded}
            onExpansionChange={isExpanded => setExpansionState({ ...expansionState, previousExpanded: isExpanded })}
            className={tx({
              [`min-w-[${expandedWidth}px] max-w-[${expandedWidth}px]`]: previousExpanded,
              [`min-w-[${notExpandedWidth}px] max-w-[${notExpandedWidth}px]`]: !previousExpanded,
            })}
          />
          <div className={tw('flex flex-col min-w-[450px] h-full')}>
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChange={(description) => setTask({ ...task, notes: description })}
              onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, notes: text })}
              className={tw('!h-[500px]')}
            />
          </div>
          <div className={tw('flex flex-col min-w-[250px] gap-y-2 justify-between items-start')}>
            <InformationSection task={task} setTask={setTask} isCreating={isCreating}/>
            {buttons}
          </div>
          <ExpandableSidebar
            tasks={task.subtasks.map(subtask => ({
              // TODO change this once tasks as subtasks is implemented
              id: subtask.id,
              name: subtask.name,
              status: subtask.isDone ? 'done' : 'todo',
              notes: '',
              subtasks: [],
              isPublicVisible: false
            }))}
            type="following"
            // TODO check this when Tasks as Subtasks API is merged
            onSubtaskChange={subtask => updateSubtask.mutate({ id: subtask.id, name: subtask.name, isDone: subtask.status === 'done' })}
            isExpanded={followingExpanded}
            onExpansionChange={isExpanded => setExpansionState({ ...expansionState, followingExpanded: isExpanded })}
            className={tx({
              [`min-w-[${expandedWidth}px] max-w-[${expandedWidth}px]`]: followingExpanded,
              [`min-w-[${notExpandedWidth}px] max-w-[${notExpandedWidth}px]`]: !followingExpanded,
            })}
          />
        </div>
      </LoadingAndErrorComponent>
    </Modal>
  )
}
