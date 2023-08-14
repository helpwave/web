import type { Active, Over } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import type { Data } from '@dnd-kit/core/dist/store/types'

export type DraggableBuilderProps = {
  isDragging: boolean,
  active: Active | null,
  over: Over | null
}

export type DraggableProps = {
  children: ((draggableBuilderProps: DraggableBuilderProps) => React.ReactNode | undefined),
  id: string,
  data?: Data
}

/**
 * A Component for the dnd kit draggable
 */
export const Draggable = ({
  children,
  id,
  data
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, ...draggableBuilderProps } = useDraggable({
    id,
    data
  })

  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
  }

  return (
    <div ref={setNodeRef} {...style} {...listeners} {...attributes}>
      {children(draggableBuilderProps)}
    </div>
  )
}
