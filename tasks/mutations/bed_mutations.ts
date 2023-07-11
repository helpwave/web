import type { PatientDTO, PatientWithTasksNumberDTO } from './patient_mutations'

export type BedDTO = {
  id: string,
  index: number,
  patient?: PatientDTO
}

export const emptyBed: BedDTO = {
  id: '',
  index: 0,
  patient: undefined
}

export type BedWithPatientWithTasksNumberDTO = {
  id: string,
  index: number,
  patient?: PatientWithTasksNumberDTO
}

export const emptyBedWithPatientWithTasksNumber: BedWithPatientWithTasksNumberDTO = {
  id: '',
  index: 0,
  patient: undefined
}

export type BedMinimalDTO = {
  id: string,
  index: number
}

export const bedQueryKey = 'beds'
