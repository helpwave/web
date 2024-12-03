import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { tw } from '@helpwave/common/twind'
import { Button } from '@helpwave/common/components/Button'
import type { TaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { defaultTaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'

type Props = {
  task: TaskDTO,
  initialTaskId: string | undefined,
  handleShowDeleteDialog: (value: boolean) => void,
  handleFinishTask: (task: TaskDTO) => void,
  handleCreateTask: (task: TaskDTO) => void
};

export const TaskDetailsButtons = ({
  overwriteTranslation,
  task,
  initialTaskId,
  handleShowDeleteDialog,
  handleFinishTask,
  handleCreateTask
}: PropsForTranslation<TaskDetailViewTranslation, Props>) => {
  const translation = useTranslation(defaultTaskDetailViewTranslation, overwriteTranslation)
  const taskNameMinimumLength = 1

  return (
    <div className={tw('flex flex-row justify-end gap-x-8')}>
      {initialTaskId !== '' ?
        (
          <>
            <Button
              color="hw-negative"
              disabled={true} // TODO reenable when backend allows it
              onClick={() => handleShowDeleteDialog(true)}
            >
              {translation.delete}
            </Button>
            {task.status !== 'done' && (
              <Button
                color="hw-positive" onClick={() => {
                handleFinishTask({ ...task, status: 'done' })
              }}
              >
                {translation.finish}
              </Button>
            )}
          </>
        )
        :
        (
          <Button
            onClick={() => handleCreateTask(task)}
            disabled={!(task.name.length >= taskNameMinimumLength)}
          >
            {translation.create}
          </Button>
        )
      }
    </div>
  )
}
