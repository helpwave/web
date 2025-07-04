import { useDroppable, type Active, type Over } from './typesafety'

export type DroppableBuilderProps<DraggableData, DroppableData> = {
  isOver: boolean,
  active: Active<DraggableData> | null,
  over: Over<DroppableData> | null,
}

export type DroppableProps<DraggableData, DroppableData> = {
  children: ((droppableBuilderProps: DroppableBuilderProps<DraggableData, DroppableData>) => React.ReactNode | undefined),
  id: string,
  data: DroppableData,
  className?: string,
}

/**
 * A Component for the dnd kit droppable
 */
export const Droppable = <DraggableData, DroppableData>({
  children,
  id,
  data,
  className,
}: DroppableProps<DraggableData, DroppableData>) => {
  const { setNodeRef, ...droppableBuilderProps } = useDroppable<DraggableData, DroppableData>({ id, data })

  return (
    <div ref={setNodeRef} className={className}>
      {children(droppableBuilderProps)}
    </div>
  )
}
