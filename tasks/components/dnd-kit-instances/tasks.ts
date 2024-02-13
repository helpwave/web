import type {
  DragStartEvent as DragStartEventFree,
  DragMoveEvent as DragMoveEventFree,
  DragOverEvent as DragOverEventFree,
  DragEndEvent as DragEndEventFree,
  DragCancelEvent as DragCancelEventFree
} from '@/components/dnd-kit/typesafety'
import { DndContext as DndContextFree } from '@/components/dnd-kit/typesafety'
import { Droppable as DroppableFree } from '@/components/dnd-kit/Droppable'
import { Draggable as DraggableFree } from '@/components/dnd-kit/Draggable'

// TODO: what should these values be? (see TasksKanbanBoard.tsx)
type DraggableData = never
type DroppableData = never

export const Droppable = DroppableFree<DraggableData, DroppableData>
export const Draggable = DraggableFree<DraggableData, DroppableData>
export const DndContext = DndContextFree<DraggableData, DroppableData>

export type DragStartEvent = DragStartEventFree<DraggableData, DroppableData>
export type DragMoveEvent = DragMoveEventFree<DraggableData, DroppableData>
export type DragOverEvent = DragOverEventFree<DraggableData, DroppableData>
export type DragEndEvent = DragEndEventFree<DraggableData, DroppableData>
export type DragCancelEvent = DragCancelEventFree<DraggableData, DroppableData>
