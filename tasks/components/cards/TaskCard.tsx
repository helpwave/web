import { tw, tx } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import { Span } from '@helpwave/common/components/Span'
import type { TaskDTO } from '../../mutations/task_mutations'
import { LockIcon } from 'lucide-react'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { Avatar } from '../Avatar'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

type TaskCardTranslation = {
  assigned: string
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
  task: TaskDTO
}

/**
 * A Card displaying the information about
 */
export const TaskCard = ({
  language,
  task,
  isSelected = false,
  onTileClick = () => undefined
}: PropsWithLanguage<TaskCardTranslation, TaskCardProps>) => {
  const translation = useTranslation(language, defaultTaskCardTranslations)
  const progress = task.subtasks.length === 0 ? 1 : task.subtasks.filter(value => value.isDone).length / task.subtasks.length
  const isOverDue = task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.TASK_STATUS_DONE

  // TODO replace by user avatar
  // Fetch for specific assignee https://github.com/helpwave/services/blob/c1c88ebaad136aef92954bf774b1e89c6a10d97f/services/user-svc/internal/models/user_models.go#L7
  const tempURL = 'https://source.boringavatars.com/marble/128/'
  const hasAssignee = !!task.assignee && task.assignee !== '00000000-0000-0000-0000-000000000000'

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
            <Span type="subsubsectionTitle" className={tw('truncate')}>{task.name}</Span>
          </div>
          <Span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>
            {task.notes}
          </Span>
        </div>
        <div className={tw('flex flex-col gap-y-1 w-[24px]')}>
          {hasAssignee && <Avatar avatarUrl={tempURL} alt={translation.assigned} size="tiny"/>}
          {task.subtasks.length > 0 && (
            <ProgressIndicator progress={progress}/>
          )}
        </div>
      </div>
    </Card>
  )
}
