import { useDroppable, type Active, type Over } from '@dnd-kit/core'
import type { Data } from '@dnd-kit/core/dist/store/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export type DroppableBuilderProps = {
  isOver: boolean,
  active: Active | null,
  over: Over | null
}

export type DroppableProps<InputData> = {
  children: ((droppableBuilderProps: DroppableBuilderProps) => React.ReactNode | undefined),
  id: string,
  data?: Data<InputData>
}

/**
 * A Component for the dnd kit droppable
 */
export const Droppable = <InputData = AnyData>({
  children,
  id,
  data
}: DroppableProps<InputData>) => {
  const { setNodeRef, ...droppableBuilderProps } = useDroppable({ id, data })

  return (
    <div ref={setNodeRef}>
      {children(droppableBuilderProps)}
    </div>
  )
}
