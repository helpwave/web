import { tw } from '@helpwave/common/twind'
import type { CardProps } from '@helpwave/common/components/Card'
import { Card } from '@helpwave/common/components/Card'
import { ProgressIndicator } from '@helpwave/common/components/ProgressIndicator'
import type { SubTaskDTO } from '../../mutations/room_mutations'
import { Span } from '@helpwave/common/components/Span'

type TaskDTO = {
  name: string,
  description: string,
  subtasks: SubTaskDTO[]
}

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
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('bg-white')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-col overflow-hidden')}>
          <Span type="subsubsectionTitle">{task.name}</Span>
          <Span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>{task.description}</Span>
        </div>
        <div className={tw('w-fit mt-1 ml-2')}>
          <ProgressIndicator progress={progress}/>
        </div>
      </div>
    </Card>
  )
}
