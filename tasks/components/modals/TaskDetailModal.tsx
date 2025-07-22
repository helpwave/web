import type { FormTranslationType, OverlayHeaderProps, Translation } from '@helpwave/hightide'
import {
  ConfirmModal,
  formTranslation,
  Input,
  Label,
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
import { ChevronRight, Globe, LockIcon, X } from 'lucide-react'
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
  useSubtaskAddMutation,
  useSubtaskDeleteMutation,
  useSubtaskUpdateMutation,
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
import { usePatientDetailsQuery } from '@helpwave/api-services/mutations/tasks/patient_mutations'
import Link from 'next/link'
import { useWardOverviewsQuery } from '@helpwave/api-services/mutations/tasks/ward_mutations'
import type { MedicalTranslationType } from '@/translation/medical'
import { medicalTranslation } from '@/translation/medical'
import type { TasksTranslationType } from '@/translation/tasks'
import { tasksTranslation } from '@/translation/tasks'

type TaskDetailViewAddonTranslation = {
  finishTask: string,
  deleteTask: string,
  deleteTaskDescription: string,
  publishTask: string,
  publishTaskDescription: string,
}

type TranslationType = FormTranslationType
  & MedicalTranslationType
  & TasksTranslationType
  & TaskDetailViewAddonTranslation

const defaultTaskDetailViewTranslation: Translation<TaskDetailViewAddonTranslation> = {
  en: {
    finishTask: 'Finish Task',
    deleteTask: 'Delete Task',
    deleteTaskDescription: 'The Tasks will be irrevocably removed',
    publishTask: 'Publish task',
    publishTaskDescription: 'This cannot be undone',
  },
  de: {
    finishTask: 'Fertigstellen',
    deleteTask: 'Task löschen',
    deleteTaskDescription: 'Der Tasks wird unwiederruflich gelöscht',
    publishTask: 'Task Veröffentlichen',
    publishTaskDescription: 'Diese Handlung kann nicht rückgängig gemacht werden',
  }
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
                               }: PropsForTranslation<TranslationType, TaskDetailViewSidebarProps>) => {
  const translation = useTranslation([formTranslation, medicalTranslation, tasksTranslation, defaultTaskDetailViewTranslation], overwriteTranslation)

  const [isShowingPublicDialog, setIsShowingPublicDialog] = useState(false)

  const updateTaskMutation = useTaskUpdateMutation()
  const assignTaskToUserMutation = useAssignTaskMutation()
  const unassignTaskToUserMutation = useUnassignTaskMutation()

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    onChange(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  const { data: patient, isLoading, isError } = usePatientDetailsQuery(task.patientId)
  const { data: wards, isLoading: isLoadingWards, isError: isErrorWards } = useWardOverviewsQuery() // TODO use a more lightwheight querry

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
          titleText: translation('publishTask'),
          descriptionText: translation('publishTaskDescription'),
        }}
      />
      <div>
        <label className="textstyle-label-md">{translation('assignee')}</label>
        <div className="row items-center gap-x-2">
          <AssigneeSelect
            value={task.assignee}
            onChange={(assignee) => {
              onChange({ ...task, assignee: assignee.userId })
              if (!isCreating) {
                assignTaskToUserMutation.mutate({ taskId: task.id, userId: assignee.userId })
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
        <label className="textstyle-label-md">{translation('dueDate')}</label>
        <div className="row items-center gap-x-2">
          <Input
            value={task.dueDate ? task.dueDate.toISOString().substring(0, 19) : ''}
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
        <Label labelType="labelMedium">{translation('status')}</Label>
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
        <Label labelType="labelMedium">{translation('visibility')}</Label>
        {!isCreating ? (
          <div className="flex-row-4 justify-between items-center">
            <div className="flex-row-1 items-center">
              {task.isPublicVisible ? (<Globe size={18}/>) : (<LockIcon size={18}/>)}
              <span
                className="font-semibold">{task.isPublicVisible ? translation('public') : translation('private')}</span>
            </div>
            {!task.isPublicVisible && !isCreating && (
              <TextButton size="small" color="primary" onClick={() => setIsShowingPublicDialog(true)}>
                <span>{translation('publish')}</span>
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
      {!isCreating && (
        <div className="flex-col-0">
          <Label labelType="labelMedium">{translation('patient', { count: 1 })}</Label>
          <LoadingAndErrorComponent
            isLoading={isLoading || isLoadingWards}
            hasError={isError || isErrorWards}
            className="min-h-7"
          >
            <Link
              href={`/ward/${patient?.wardId ?? (wards ?? [])[0]?.id}?patientId=${patient?.id}`}
              className="flex-row-4 justify-between items-center group"
            >
              <span className="font-semibold">{patient?.humanReadableIdentifier}</span>
              <ChevronRight size={20}
                            className="min-h-7 min-w-7 p-1 rounded-md group-hover:bg-button-text-hover-background"/>
            </Link>
          </LoadingAndErrorComponent>
        </div>
      )}
      {task.createdAt && (
        <div className="col gap-y-1">
          <span className="textstyle-label-md">{translation('createdAt')}</span>
          <TimeDisplay date={new Date(task.createdAt)}/>
        </div>
      )}
    </div>
  )
}

type CreateInformation = {
  wardId: string,
  patientId: string,
  initialStatus: TaskStatus,
}
export type TaskDetailModalProps = Omit<ModalProps, keyof OverlayHeaderProps> & Pick<ModalProps, 'onClose'> & {
  /**
   * A not set or empty taskId is seen as creating a new task
   */
  taskId?: string,
  createInformation?: CreateInformation,
}

/**
 * A Modal Wrapper for the task detail view
 */
export const TaskDetailModal = ({
                                  overwriteTranslation,
                                  taskId = '',
                                  onClose,
                                  createInformation,
                                  className,
                                  ...modalProps
                                }: PropsForTranslation<TranslationType, TaskDetailModalProps>) => {
  const translation = useTranslation([formTranslation, medicalTranslation, tasksTranslation, defaultTaskDetailViewTranslation], overwriteTranslation)
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
    patientId: createInformation?.patientId ?? '',
    status: createInformation?.initialStatus ?? 'todo'
  })

  const deleteTaskMutation = useTaskDeleteMutation()
  const updateTaskMutation = useTaskUpdateMutation()
  const createTaskMutation = useTaskCreateMutation({
    onSuccess: () => onClose()
  })

  const addSubtaskMutation = useSubtaskAddMutation()
  const updateSubtaskMutation = useSubtaskUpdateMutation()
  const deleteSubtaskMutation = useSubtaskDeleteMutation()

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
  } = useWardTaskTemplateQuery(createInformation?.wardId)

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
              {translation('delete')}
            </SolidButton>
            {task.status !== 'done' && (
              <SolidButton color="positive" onClick={() => {
                updateTaskMutation.mutate({ ...task, status: 'done' })
                onClose()
              }}>
                {translation('finishTask')}
              </SolidButton>
            )}
          </>
        ) : (
          <SolidButton onClick={() => createTaskMutation.mutate(task)} disabled={!isValid}>
            {translation('create')}
          </SolidButton>
        )
      }
    </div>
  )

  const tasksDetails = (
    <div className="row justify-between gap-x-8">
      <div className="col grow gap-y-8 min-w-[300px]">
        <div className="min-h-[25%]">
          <Textarea
            headline={translation('notes')}
            value={task.notes}
            onChangeText={(description) => setTask({ ...task, notes: description })}
            onEditCompleted={(text) => updateTaskLocallyAndExternally({ ...task, notes: text })}
          />
        </div>
        <SubtaskView
          subtasks={task.subtasks}
          taskOrTemplateId={taskId}
          onChange={(subtasks) => setTask({ ...task, subtasks })}
          onAdd={subtask => addSubtaskMutation.mutate(subtask)}
          onUpdate={subtask => updateSubtaskMutation.mutate(subtask)}
          onRemove={subtask => deleteSubtaskMutation.mutate(subtask)}
        />
      </div>
      <TaskDetailViewSidebar task={task} onChange={setTask} isCreating={isCreating}/>
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
      className="absolute left-[-250px] top-0 col w-[250px] overflow-hidden p-4 pb-0 rounded-l-xl h-full bg-task-modal-sidebar-background text-task-modal-sidebar-text"
    >
      {personalTaskTemplatesData && wardTaskTemplatesData && (
        <TaskTemplateListColumn
          templates={taskTemplates}
          activeId={selectedTemplateId}
          onTileClick={({ id, name, notes, subtasks }) => {
            setSelectedTemplateId(id)
            setTask({ ...task, name, notes, subtasks })
          }}
          onColumnEditClick={() => router.push(`/ward/${createInformation?.wardId}/templates`)}
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
          titleText: `${translation('deleteTask')}?`,
          descriptionText: `${translation('deleteTaskDescription')}`
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
        {...modalProps}
        className={clsx('relative gap-y-2 max-w-[800px] w-[calc(100vw-532px)]', {
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
      >
        {isCreating && templateSidebar}
        <LoadingAndErrorComponent
          isLoading={(isLoading || !data) && !isCreating}
          hasError={isError}
          className="min-h-138"
        >
          {tasksDetails}
          {buttons}
        </LoadingAndErrorComponent>
      </Modal>
    </>
  )
}
