import { tw, tx } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import { Span } from '@helpwave/common/components/Span'
import type { TaskDTO } from '../../mutations/task_mutations'
import { LockIcon } from 'lucide-react'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'

export type TaskCardProps = CardProps & {
  task: TaskDTO
}

/**
 * A Card displaying the information about
 */
export const TaskCard = ({
  task,
  isSelected = false,
  onTileClick = () => undefined
}: TaskCardProps) => {
  const progress = task.subtasks.length === 0 ? 1 : task.subtasks.filter(value => value.isDone).length / task.subtasks.length
  const isOverDue = task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.TASK_STATUS_DONE

  return (
    <Card
      onTileClick={onTileClick}
      isSelected={isSelected}
      className={tx('bg-white', {
        '!border-hw-negative-400 !hover:border-hw-negative-600': isOverDue,
        '!border-hw-negative-600': isOverDue && isSelected,
      })}
    >
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-col overflow-hidden')}>
          <div className={tw('flex flex-row overflow-hidden items-center gap-x-1')}>
            {!task.isPublicVisible && <div className={tw('w-[12px]')}><LockIcon size={12}/></div>}
            <Span type="subsubsectionTitle" className={tw('truncate')}>{task.name}</Span>
          </div>
          <Span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>
            {task.notes}
          </Span>
        </div>
        {task.subtasks.length > 0 && (
          <div className={tw('w-fit mt-1 ml-2')}>
            <ProgressIndicator progress={progress}/>
          </div>
        )}
      </div>
    </Card>
  )
}
