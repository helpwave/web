import type { TaskDTO, TaskMinimalDTO } from './task'

export type PatientMinimalDTO = {
  id: string,
  name: string,
}

export type PatientDTO = PatientMinimalDTO & {
  note: string,
  tasks: TaskMinimalDTO[],
}

export const emptyPatient: PatientDTO = {
  id: '',
  note: '',
  name: '',
  tasks: []
}

export type PatientWithTasksNumberDTO = PatientMinimalDTO & {
  tasksTodo: number,
  tasksInProgress: number,
  tasksDone: number,
}

export type PatientCompleteDTO = PatientMinimalDTO & {
  note: string,
  tasks: TaskDTO[],
}

export const emptyPatientMinimal: PatientMinimalDTO = {
  id: '',
  name: ''
}

export type PatientWithBedAndRoomDTO = PatientMinimalDTO & {
  room: { id: string, name: string, wardId: string },
  bed: { id: string, name: string },
}

export type RecentPatientDTO = PatientMinimalDTO & {
  wardId?: string,
  room?: { id: string, name: string },
  bed?: { id: string, name: string },
}

export type PatientListDTO = {
  active: PatientWithBedAndRoomDTO[],
  unassigned: PatientMinimalDTO[],
  discharged: PatientMinimalDTO[],
}

export type PatientWithBedIdDTO = PatientMinimalDTO & {
  note: string,
  bedId: string,
}

export type PatientDetailsDTO = PatientMinimalDTO & {
  note: string,
  tasks: TaskDTO[],
  discharged: boolean,
}

export const emptyPatientDetails: PatientDetailsDTO = {
  id: '',
  name: '',
  note: '',
  tasks: [],
  discharged: false
}
