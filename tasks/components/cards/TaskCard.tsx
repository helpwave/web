import { tw, tx } from '@helpwave/style-themes/twind'
import { Card, type CardProps } from '@helpwave/common/components/Card'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import { LockIcon } from 'lucide-react'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Avatar } from '@helpwave/common/components/Avatar'
import type { TaskDTO } from '@helpwave/api-services/types/tasks/task'
import { useUserQuery } from '@helpwave/api-services/mutations/users/user_mutations'

type TaskCardTranslation = {
  assigned: string,
}

const defaultTaskCardTranslations: Record<Languages, TaskCardTranslation> = {
  en: {
    assigned: 'assigned'
  },
  de: {
    assigned: 'zugewiesen'
  }
}

export type TaskCardProps = CardProps & {
  task: TaskDTO,
}

/**
 * A Card displaying the information about
 */
export const TaskCard = ({
  overwriteTranslation,
  task,
  isSelected = false,
  onTileClick = () => undefined
}: PropsForTranslation<TaskCardTranslation, TaskCardProps>) => {
  const translation = useTranslation(defaultTaskCardTranslations, overwriteTranslation)
  const progress = task.subtasks.length === 0 ? 1 : task.subtasks.filter(value => value.isDone).length / task.subtasks.length
  const isOverDue = task.dueDate && task.dueDate < new Date() && task.status !== 'done'

  const { data: assignee } = useUserQuery(task.assignee)

  return (
    <Card
      onTileClick={onTileClick}
      isSelected={isSelected}
      className={tx('bg-white !p-2', {
        '!border-hw-negative-400 !hover:border-hw-negative-600': isOverDue,
        '!border-hw-negative-600': isOverDue && isSelected,
      })}
    >
      <div className={tw('flex flex-row justify-between w-full gap-x-2')}>
        <div className={tw('flex flex-col overflow-hidden')}>
          <div className={tw('flex flex-row overflow-hidden items-center gap-x-1')}>
            {!task.isPublicVisible && <div className={tw('w-[12px]')}><LockIcon size={12}/></div>}
            <span className={tw('textstyle-title-sm truncate')}>{task.name}</span>
          </div>
          <span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>
            {task.notes}
          </span>
        </div>
        <div className={tw('flex flex-col gap-y-1 w-[24px]')}>
          {assignee && assignee.avatarUrl && <Avatar avatarUrl={assignee.avatarUrl} alt={translation.assigned} size="tiny"/>}
          {task.subtasks.length > 0 && (
            <ProgressIndicator progress={progress}/>
          )}
        </div>
      </div>
    </Card>
  )
}
