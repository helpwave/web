import type { PatientDTO, PatientMinimalDTO, PatientWithTasksNumberDTO } from './patient'

export type BedMinimalDTO = {
  id: string,
  name: string
}

export type BedDTO = BedMinimalDTO & {
  patient?: PatientDTO
}

export const emptyBed: BedDTO = {
  id: '',
  name: '',
  patient: undefined
}

export type BedWithPatientWithTasksNumberDTO = BedMinimalDTO & {
  patient?: PatientWithTasksNumberDTO
}

export const emptyBedWithPatientWithTasksNumber: BedWithPatientWithTasksNumberDTO = {
  id: '',
  name: '',
  patient: undefined
}

export type BedWithRoomId = BedMinimalDTO & {
  roomId: string
}

export type BedWithMinimalPatientDTO = BedMinimalDTO & {
  patient?: PatientMinimalDTO
}

export type BedWithPatientId = {
  id: string,
  patientId: string
}
