import { tw } from '@helpwave/common/twind'
import type { CardProps } from './Card'
import { Card } from './Card'
import { ProgressIndicator } from '../ProgressIndicator'

type TaskDTO = {
  name: string,
  description: string
}

export type TaskCardProps = CardProps & {
  progress: number,
  task: TaskDTO
}

export const TaskCard = ({
  progress,
  task,
  isSelected = false,
  onTileClick = () => undefined
}: TaskCardProps) => {
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected} className={tw('bg-white')}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('flex flex-col overflow-hidden')}>
          <span className={tw('font-bold')}>{task.name}</span>
          <span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>{task.description}</span>
        </div>
        <div className={tw('w-fit mt-1 ml-2')}>
          <ProgressIndicator progress={progress}/>
        </div>
      </div>
    </Card>
  )
}
