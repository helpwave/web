import type { PatientMinimalDTO, PatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/patient'
import type { BedWithPatientWithTasksNumberDTO } from '@helpwave/api-services/types/tasks/bed'
import type { RoomOverviewDTO } from '@helpwave/api-services/types/tasks/room'
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

export type WardOverviewDraggableData = {
  type: 'patientListItem',
  patient: PatientMinimalDTO,
  discharged: boolean,
  assigned: boolean,
} | {
  type: 'assignedPatient',
  bed: BedWithPatientWithTasksNumberDTO,
  room: RoomOverviewDTO,
  patient: PatientWithTasksNumberDTO,
}
export type WardOverViewDroppableData = {
  type: 'bed',
  bed: BedWithPatientWithTasksNumberDTO,
  room: RoomOverviewDTO,
  patient?: PatientMinimalDTO,
} | {
  type: 'section',
  section: 'unassigned' | 'discharged',
}

export const WardOverviewDroppable = DroppableFree<WardOverviewDraggableData, WardOverViewDroppableData>
export const WardOverviewDraggable = DraggableFree<WardOverviewDraggableData, WardOverViewDroppableData>
export const WardOverviewDndContext = DndContextFree<WardOverviewDraggableData, WardOverViewDroppableData>

export type WardOverviewDragStartEvent = DragStartEventFree<WardOverviewDraggableData, WardOverViewDroppableData>
export type WardOverviewDragMoveEvent = DragMoveEventFree<WardOverviewDraggableData, WardOverViewDroppableData>
export type WardOverviewDragOverEvent = DragOverEventFree<WardOverviewDraggableData, WardOverViewDroppableData>
export type WardOverviewDragEndEvent = DragEndEventFree<WardOverviewDraggableData, WardOverViewDroppableData>
export type WardOverviewDragCancelEvent = DragCancelEventFree<WardOverviewDraggableData, WardOverViewDroppableData>
