import type { SubTaskDTO, TaskDTO } from '@helpwave/api-services/types/tasks/task'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw, tx } from '@helpwave/common/twind'
import { ModalHeader } from '@helpwave/common/components/modals/Modal'
import { ToggleableInput } from '@helpwave/common/components/user-input/ToggleableInput'
import { Textarea } from '@helpwave/common/components/user-input/Textarea'
import type { TaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { defaultTaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { TaskDetailsButtons } from './TaskDetailsButtons'
import { TaskDetailViewSidebar } from './TaskDetailViewSidebar'
import { SubtaskView } from '@/components/SubtaskView'

type Props = {
  task: TaskDTO,
  initialTaskId: string | undefined,
  handleModalClose: () => void,
  handleOnChange: (task: TaskDTO) => void,
  handleOnCompleted: (task: TaskDTO) => void,
  handleShowDeleteDialog: (value: boolean) => void,
  handleFinishTask: (task: TaskDTO) => void,
  handleCreateTask: (task: TaskDTO) => void
};

export const TaskDetails = ({
  overwriteTranslation,
  task,
  initialTaskId,
  handleModalClose,
  handleOnChange,
  handleOnCompleted,
  handleShowDeleteDialog,
  handleFinishTask,
  handleCreateTask
}: PropsForTranslation<TaskDetailViewTranslation, Props>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)

  const isCreating = initialTaskId === ''
  const minTaskNameLength = 4
  const maxTaskNameLength = 32

  return (
    <div
      className={tx('flex flex-col', {
        'pl-6': isCreating,
        'px-2': !isCreating
      })}
    >
      <ModalHeader
        title={(
          <ToggleableInput
            autoFocus={isCreating}
            initialState="editing"
            id="name"
            value={task.name}
            onChange={(name) => handleOnChange({ ...task, name })}
            onEditCompleted={(text) => handleOnCompleted({ ...task, name: text })}
            labelClassName={tw('text-2xl font-bold')}
            minLength={minTaskNameLength}
            maxLength={maxTaskNameLength}
            size={24}
          />
        )}
        onCloseClick={handleModalClose}
      />
      <div className={tw('flex flex-row flex-1 gap-x-8 mt-3')}>
        <div className={tw('flex flex-col gap-y-8 w-[60%] min-w-[500px]')}>
          <div className={tw('min-h-[25%]')}>
            <Textarea
              headline={translation.notes}
              value={task.notes}
              onChange={(description) => handleOnChange({ ...task, notes: description })}
              onEditCompleted={(text) => handleOnCompleted({ ...task, notes: text })}
            />
          </div>
          <SubtaskView
            subtasks={task.subtasks}
            taskId={initialTaskId}
            onChange={(subtasks: SubTaskDTO[]) => handleOnChange({ ...task, subtasks })}
          />
        </div>

        <TaskDetailViewSidebar task={task} setTask={handleOnChange} isCreating={isCreating} />
      </div>

      <TaskDetailsButtons
        task={task}
        initialTaskId={initialTaskId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleFinishTask={handleFinishTask}
        handleCreateTask={handleCreateTask}
      />
    </div>
  )
}
