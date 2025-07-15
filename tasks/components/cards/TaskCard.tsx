import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { Avatar, noop, ProgressIndicator, type PropsForTranslation, useTranslation } from '@helpwave/hightide'
import { LockIcon, UserIcon } from 'lucide-react'
import type { TaskDTO, TaskStatusTranslationType } from '@helpwave/api-services/types/tasks/task'
import { TaskStatusUtil } from '@helpwave/api-services/types/tasks/task'
import { useUserQuery } from '@helpwave/api-services/mutations/users/user_mutations'

type TaskCardTranslation = {
  assigned: string,
  noDescription: string,
}

const defaultTaskCardTranslations: Translation<TaskCardTranslation> = {
  en: {
    assigned: 'assigned',
    noDescription: 'No description',
  },
  de: {
    assigned: 'zugewiesen',
    noDescription: 'Keine Beschreibung',
  }
}

type TranslationType = TaskCardTranslation & TaskStatusTranslationType

export type TaskCardProps = {
  task: TaskDTO,
  onClick: () => void,
  isSelected?: boolean,
  showStatus?: boolean,
  className?: string,
}

/**
 * A Card displaying the information about
 */
export const TaskCard = ({
                           overwriteTranslation,
                           task,
                           isSelected = false,
                           showStatus = false,
                           onClick = noop,
                           className,
                         }: PropsForTranslation<TranslationType, TaskCardProps>) => {
  const translation = useTranslation([TaskStatusUtil.translation, defaultTaskCardTranslations], overwriteTranslation)
  const progress = task.subtasks.length === 0 ? 1 : task.subtasks.filter(value => value.isDone).length / task.subtasks.length
  const isOverDue = task.dueDate && task.dueDate < new Date() && task.status !== 'done'

  const { data: assignee } = useUserQuery(task.assignee)

  return (
    <div
      onClick={onClick}
      className={clsx('card-md flex-row-2 w-full justify-between !p-2 border-2 hover:border-primary cursor-pointer', {
        'border-negative': isOverDue,
        'border-primary': isSelected && !isOverDue,
      }, className)}
    >
      <div className="flex-col-2 justify-between overflow-hidden">
        <div className="flex-col-1 overflow-hidden">
          <div className="flex-row-1 overflow-hidden items-center">
            {!task.isPublicVisible && <div className="w-4"><LockIcon size={16}/></div>}
            <span className="textstyle-title-normal truncate">{task.name}</span>
          </div>
          <span
            className={clsx(
              'truncate w-full',
              {
                'text-description': !!task.notes,
                'text-disabled-text': !task.notes,
              }
            )}
          >
            {task.notes ? task.notes : translation('noDescription')}
        </span>
        </div>
        {showStatus && (
          <div
            className={clsx(
              'chip justify-start w-min text-nowrap', TaskStatusUtil.colors[task.status].background, TaskStatusUtil.colors[task.status].text
            )}
          >
            {translation(task.status)}
          </div>
        )}
      </div>
      <div className="flex-col-2 min-w-6">
        {(assignee && assignee.avatarUrl) ?
          (<Avatar avatarUrl={assignee.avatarUrl} alt={translation('assigned')} size="tiny"/>):
          (<UserIcon className="min-w-6 bg-disabled-background text-disabled-text rounded-full" size={24}/>)
        }
        <ProgressIndicator progress={task.subtasks.length > 0 ? progress : 1}/>
      </div>
    </div>
  )
}
