import type { BedDTO, BedWithMinimalPatientDTO, BedWithPatientWithTasksNumberDTO } from './bed'

export type RoomMinimalDTO = {
  id: string,
  name: string,
  wardId: string,
}

export type RoomDTO = RoomMinimalDTO & {
  beds: BedDTO[],
}

export type RoomOverviewDTO = RoomMinimalDTO & {
  beds: BedWithPatientWithTasksNumberDTO[],
}

export const emptyRoomOverview: RoomOverviewDTO = {
  id: '',
  name: '',
  wardId: '',
  beds: []
}

export type RoomWithMinimalBedAndPatient = RoomMinimalDTO & {
  beds: BedWithMinimalPatientDTO[],
}
