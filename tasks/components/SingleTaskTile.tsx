import { tw } from '@helpwave/common/twind/index'
import type { CardProps } from './Card'
import { Card } from './Card'
import { ProgressIndicator } from './ProgressIndicator'

type TaskDTO = {
  name: string,
  description: string
}

export type SingleTaskTileProps = CardProps & {
  progress: number,
  task: TaskDTO
}

export const SingleTaskTile = ({
  progress,
  task,
  isSelected = false,
  onTileClick = () => undefined
}: SingleTaskTileProps) => {
  return (
    <Card onTileClick={onTileClick} isSelected={isSelected}>
      <div className={tw('flex flex-row justify-between w-full')}>
        <div className={tw('overflow-hidden')}>
          <span className={tw('font-bold font-space')}>{task.name}</span>
          <br/>
          <span className={tw('overflow-hidden w-full block text-gray-500 text-ellipsis whitespace-nowrap')}>{task.description}</span>
        </div>
        <div className={tw('w-fit mt-1 ml-2')}>
          <ProgressIndicator progress={progress}/>
        </div>
      </div>
    </Card>
  )
}
