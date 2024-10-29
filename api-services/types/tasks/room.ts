import type { BedDTO, BedWithMinimalPatientDTO, BedWithPatientWithTasksNumberDTO } from './bed'

export type RoomMinimalDTO = {
  id: string,
  name: string
}

export type RoomWithWardId = RoomMinimalDTO & {
  wardId: string
}

export type RoomDTO = RoomMinimalDTO & {
  beds: BedDTO[]
}

export type RoomOverviewDTO = RoomMinimalDTO & {
  beds: BedWithPatientWithTasksNumberDTO[]
}

export const emptyRoomOverview: RoomOverviewDTO = {
  id: '',
  name: '',
  beds: []
}

export type RoomWithMinimalBedAndPatient = RoomMinimalDTO & {
  beds: BedWithMinimalPatientDTO[]
}
