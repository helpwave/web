import type { PatientMinimalDTO } from '@helpwave/api-services/types/tasks/patient'
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

type DraggableData = {
  // patient from 'patient list'
  patient: PatientMinimalDTO,
  discharged: boolean,
} | {
  // patient from 'room overview'
  bed: BedWithPatientWithTasksNumberDTO,
  room: RoomOverviewDTO,
  patient: PatientMinimalDTO,
}
type DroppableData = {
  bed: BedWithPatientWithTasksNumberDTO,
  room: RoomOverviewDTO,
  patient: PatientMinimalDTO | undefined,
} | {
  patientListSection: 'unassigned' | 'discharged',
}

export const Droppable = DroppableFree<DraggableData, DroppableData>
export const Draggable = DraggableFree<DraggableData, DroppableData>
export const DndContext = DndContextFree<DraggableData, DroppableData>

export type DragStartEvent = DragStartEventFree<DraggableData, DroppableData>
export type DragMoveEvent = DragMoveEventFree<DraggableData, DroppableData>
export type DragOverEvent = DragOverEventFree<DraggableData, DroppableData>
export type DragEndEvent = DragEndEventFree<DraggableData, DroppableData>
export type DragCancelEvent = DragCancelEventFree<DraggableData, DroppableData>
