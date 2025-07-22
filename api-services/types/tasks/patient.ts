import type { TaskDTO, TaskMinimalDTO } from './task'
import type { RoomMinimalDTO } from './room'
import type { BedMinimalDTO } from './bed'

export type PatientMinimalDTO = {
  id: string,
  humanReadableIdentifier: string,
  bedId?: string,
}

export type PatientWithBedIdDTO = PatientMinimalDTO & {
  notes: string,
  bedId?: string,
}

export type PatientDTO = PatientMinimalDTO & {
  notes: string,
  tasks: TaskMinimalDTO[],
}

export type PatientWithTasksNumberDTO = PatientMinimalDTO & {
  tasksTodo: number,
  tasksInProgress: number,
  tasksDone: number,
}

export type PatientWithBedAndRoomDTO = PatientMinimalDTO & {
  room: RoomMinimalDTO,
  bed: BedMinimalDTO,
}

export type RecentPatientDTO = PatientMinimalDTO & {
  wardId?: string,
  room?: RoomMinimalDTO,
  bed?: BedMinimalDTO,
}

export type PatientListDTO = {
  active: PatientWithBedAndRoomDTO[],
  unassigned: PatientMinimalDTO[],
  discharged: PatientMinimalDTO[],
}

export type PatientDetailsDTO = PatientMinimalDTO & {
  notes: string,
  tasks: TaskDTO[],
  discharged: boolean,
  room?: RoomMinimalDTO,
  bed?: BedMinimalDTO,
  wardId?: string,
}

export const emptyPatientDetails: PatientDetailsDTO = {
  id: '',
  humanReadableIdentifier: '',
  notes: '',
  tasks: [],
  discharged: false
}
