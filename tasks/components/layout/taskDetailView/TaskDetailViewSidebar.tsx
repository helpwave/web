import { type PropsForTranslation, useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import {
  useAssignTaskMutation,
  useTaskUpdateMutation,
  useUnassignTaskMutation
} from '@helpwave/api-services/mutations/tasks/task_mutations'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import { tw } from '@helpwave/common/twind'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { Span } from '@helpwave/common/components/Span'
import { Button } from '@helpwave/common/components/Button'
import { X } from 'lucide-react'
import { Input } from '@helpwave/common/components/user-input/Input'
import { formatDate } from '@helpwave/common/util/date'
import { TimeDisplay } from '@helpwave/common/components/TimeDisplay'
import type { TaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { defaultTaskDetailViewTranslation } from './defaultTaskDetailViewTranslation'
import { AssigneeSelect } from '@/components/selects/AssigneeSelect'
import { TaskStatusSelect } from '@/components/selects/TaskStatusSelect'
import { TaskVisibilitySelect } from '@/components/selects/TaskVisibilitySelect'

type Props = {
  task: TaskDTO,
  setTask: (task: TaskDTO) => void,
  isCreating: boolean
};

export const TaskDetailViewSidebar = ({
  overwriteTranslation,
  task,
  setTask,
  isCreating
}: PropsForTranslation<TaskDetailViewTranslation, Props>) => {
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
          <TimeDisplay date={new Date(task.createdAt)} />
        </div>
      )}
    </div>
  )
}
