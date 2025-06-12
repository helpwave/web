import { useDraggable, type Active, type Over } from './typesafety'

export type DraggableBuilderProps<DraggableData, DroppableData> = {
  isDragging: boolean,
  active: Active<DraggableData> | null,
  over: Over<DroppableData> | null,
}

export type DraggableProps<DraggableData, DroppableData> = {
  children: ((draggableBuilderProps: DraggableBuilderProps<DraggableData, DroppableData>) => React.ReactNode | undefined),
  id: string,
  data: DraggableData,
  className?: string,
}

/**
 * A Component for the dnd kit draggable
 */
export const Draggable = <DraggableData, DroppableData>({
  children,
  id,
  data,
  className,
}: DraggableProps<DraggableData, DroppableData>) => {
  const { attributes, listeners, setNodeRef, transform, ...draggableBuilderProps } = useDraggable<DraggableData, DroppableData>({
    id,
    data
  })

  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
  }

  return (
    <div ref={setNodeRef} {...style} {...listeners} {...attributes} className={className}>
      {children(draggableBuilderProps)}
    </div>
  )
}
