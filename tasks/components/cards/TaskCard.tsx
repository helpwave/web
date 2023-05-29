import { tw, tx } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import { Span } from '@helpwave/common/components/Span'
import type { TaskDTO } from '../../mutations/room_mutations'

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
  const isOverDue = task.dueDate < new Date() && task.status !== 'done'
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
          <Span type="subsubsectionTitle">{task.name}</Span>
          <Span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>
            {task.description}
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
