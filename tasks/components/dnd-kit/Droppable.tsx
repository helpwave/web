import type { Active, Over } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import type { Data } from '@dnd-kit/core/dist/store/types'

export type DroppableBuilderProps = {
  isOver: boolean,
  active: Active | null,
  over: Over | null
}

export type DroppableProps = {
  children: ((droppableBuilderProps: DroppableBuilderProps) => React.ReactNode | undefined),
  id: string,
  data?: Data
}

/**
 * A Component for the dnd kit droppable
 */
export const Droppable = ({
  children,
  id,
  data
}: DroppableProps) => {
  const { setNodeRef, ...droppableBuilderProps } = useDroppable({ id, data })

  return (
    <div ref={setNodeRef}>
      {children(droppableBuilderProps)}
    </div>
  )
}
