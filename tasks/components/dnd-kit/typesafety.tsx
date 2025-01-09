import { useDraggable as useDraggableUnsafe, useDroppable as useDroppableUnsafe, DndContext as DndContextUnsafe } from '@dnd-kit/core'
import type {
  Collision,
  Translate,
  Active as ActiveUnsafe,
  Over as OverUnsafe,
  DndContextProps as DndContextPropsUnsafe,
  UseDraggableArguments as UseDraggableArgumentsUnsafe,
  UseDroppableArguments as UseDroppableArgumentsUnsafeUnsafe
} from '@dnd-kit/core'

export type UseDroppableArguments<DroppableData> = Omit<UseDroppableArgumentsUnsafeUnsafe, 'data'> & {
  data: DroppableData,
}

export type UseDraggableArguments<DraggableData> = Omit<UseDraggableArgumentsUnsafe, 'data'> & {
  data: DraggableData,
}

export type Active<DraggableData> = Omit<ActiveUnsafe, 'data'> & {
  data: React.MutableRefObject<DraggableData | undefined>,
}
export type Over<DroppableData> = Omit<OverUnsafe, 'data'> & {
  data: React.MutableRefObject<DroppableData | undefined>,
}

export type DragEvent<DraggableData, DroppableData> = {
  activatorEvent: Event,
  active: Active<DraggableData>,
  collisions: Collision[] | null,
  delta: Translate,
  over: Over<DroppableData> | null,
}

export type DragStartEvent<DraggableData, DroppableData> = Pick<DragEvent<DraggableData, DroppableData>, 'active'>
export type DragMoveEvent<DraggableData, DroppableData> = DragEvent<DraggableData, DroppableData>
export type DragOverEvent<DraggableData, DroppableData> = DragMoveEvent<DraggableData, DroppableData>
export type DragEndEvent<DraggableData, DroppableData> = DragEvent<DraggableData, DroppableData>
export type DragCancelEvent<DraggableData, DroppableData> = DragEndEvent<DraggableData, DroppableData>

export type DndContextTypesafeProps<DraggableData, DroppableData> = Omit<
  DndContextPropsUnsafe,
  'onDragStart' | 'onDragMove' | 'onDragOver' | 'onDragEnd' | 'onDragCancel'
> & {
  onDragStart?(event: DragStartEvent<DraggableData, DroppableData>): void,
  onDragMove?(event: DragMoveEvent<DraggableData, DroppableData>): void,
  onDragOver?(event: DragOverEvent<DraggableData, DroppableData>): void,
  onDragEnd?(event: DragEndEvent<DraggableData, DroppableData>): void,
  onDragCancel?(event: DragCancelEvent<DraggableData, DroppableData>): void,
}

export const DndContext = <DraggableData, DroppableData>(props: DndContextTypesafeProps<DraggableData, DroppableData>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DndContextUnsafe { ...props as any } />
}

type UseDraggableReturnValue<DraggableData, DroppableData> = Omit<ReturnType<typeof useDraggableUnsafe>, 'active' | 'over'> & {
  active: Active<DraggableData> | null,
  over: Over<DroppableData> | null,
}

export const useDraggable = <DraggableData, DroppableData>(props: UseDraggableArguments<DraggableData>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDraggableUnsafe(props as any) as UseDraggableReturnValue<DraggableData, DroppableData>

type UseDroppableReturnValue<DraggableData, DroppableData> = Omit<ReturnType<typeof useDroppableUnsafe>, 'active' | 'over'> & {
  active: Active<DraggableData> | null,
  over: Over<DroppableData> | null,
}

export const useDroppable = <DraggableData, DroppableData>(props: UseDroppableArguments<DroppableData>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDroppableUnsafe(props as any) as UseDroppableReturnValue<DraggableData, DroppableData>
