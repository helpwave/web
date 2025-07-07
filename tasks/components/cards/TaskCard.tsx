import clsx from 'clsx'
import { ProgressIndicator } from '@helpwave/hightide'
import { LockIcon } from 'lucide-react'
import type { Translation } from '@helpwave/hightide'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'
import { Avatar } from '@helpwave/hightide'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import { useUserQuery } from '@helpwave/api-services/mutations/users/user_mutations'

type TaskCardTranslation = {
  assigned: string,
}

const defaultTaskCardTranslations: Translation<TaskCardTranslation> = {
  en: {
    assigned: 'assigned'
  },
  de: {
    assigned: 'zugewiesen'
  }
}

export type TaskCardProps = {
  task: TaskDTO,
  onClick: () => void,
  isSelected: boolean,
}

/**
 * A Card displaying the information about
 */
export const TaskCard = ({
                           overwriteTranslation,
                           task,
                           isSelected = false,
                           onClick = () => undefined
                         }: PropsForTranslation<TaskCardTranslation, TaskCardProps>) => {
  const translation = useTranslation([defaultTaskCardTranslations], overwriteTranslation)
  const progress = task.subtasks.length === 0 ? 1 : task.subtasks.filter(value => value.isDone).length / task.subtasks.length
  const isOverDue = task.dueDate && task.dueDate < new Date() && task.status !== 'done'

  const { data: assignee } = useUserQuery(task.assignee)

  return (
    <div
      onClick={onClick}
      className={clsx('card-md row w-full justify-between !p-2', {
        'border-negative hover:brightness-75': isOverDue,
        'border-negative': isOverDue && isSelected,
        'border-primary': isSelected,
      })}
    >
      <div className="col gap-y-0 overflow-hidden">
        <div className="row overflow-hidden items-center gap-x-1">
          {!task.isPublicVisible && <div className="w-[12px]"><LockIcon size={12}/></div>}
          <span className="textstyle-title-sm truncate">{task.name}</span>
        </div>
        <span className="overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap">
            {task.notes}
          </span>
      </div>
      <div className="col gap-y-1 w-[24px]">
        {assignee && assignee.avatarUrl &&
          <Avatar avatarUrl={assignee.avatarUrl} alt={translation('assigned')} size="tiny"/>}
        {task.subtasks.length > 0 && (
          <ProgressIndicator progress={progress}/>
        )}
      </div>
    </div>
  )
}
