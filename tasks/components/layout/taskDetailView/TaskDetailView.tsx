import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw, tx } from '@helpwave/common/twind'
import { useEffect, useState } from 'react'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import type { TaskDTO, TaskStatus } from '@helpwave/api-services/types/tasks/task'
import { emptyTask } from '@helpwave/api-services/types/tasks/task'
import {
  useAssignTaskMutation,
  useSubTaskAddMutation,
  useTaskCreateMutation,
  useTaskQuery,
  useTaskUpdateMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import type { TaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { defaultTaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { TaskDetails } from './TaskDetails'
import { TaskDetailViewTemplateSidebar } from './TaskDetailViewTemplateSidebar'

/**
 * A not set or empty taskId is seen as creating a new task
 */
export type TaskDetailViewProps = {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

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

  const updateTaskLocallyAndExternally = (task: TaskDTO) => {
    setTask(task)
    if (!isCreating) {
      updateTaskMutation.mutate(task)
    }
  }

  return (
    <>
      <ConfirmDialog
        id="deleteTaskDialog"
        isOpen={isDeleteDialogOpen}
        titleText={`${translation.deleteTask}?`}
        descriptionText={`${translation.deleteTaskDescription}`}
        onConfirm={() => {
          // deleteTaskMutation.mutate(task.id)
          setIsDeleteDialogOpen(false)
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onCloseClick={() => setIsDeleteDialogOpen(false)}
        onBackgroundClick={() => setIsDeleteDialogOpen(false)}
        buttonOverwrites={[{}, {}, { color: 'hw-negative' }]}
      />
      <LoadingAndErrorComponent
        isLoading={(isLoading || !data) && !isCreating}
        hasError={isError}
        loadingProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
        errorProps={{ classname: tw('min-h-[300px] min-w-[600px] h-[50vh] max-h-[600px]') }}
      >
        <div className={tx('relative flex flex-row')}>
          <TaskDetailViewTemplateSidebar
            isCreating={isCreating}
            task={task}
            wardId={wardId}
            handleOnTileClick={setTask}
          />

          <TaskDetails
            task={task}
            initialTaskId={taskId}
            handleModalClose={onClose}
            handleOnChange={setTask}
            handleOnCompleted={updateTaskLocallyAndExternally}
            handleShowDeleteDialog={setIsDeleteDialogOpen}
            handleFinishTask={(taskToFinish: TaskDTO) => {
              updateTaskMutation.mutate(taskToFinish)
              onClose()
            }}
            handleCreateTask={createTaskMutation.mutate}
          />
        </div>
      </LoadingAndErrorComponent>
    </>
  )
}
