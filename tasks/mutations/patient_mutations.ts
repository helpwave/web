import type { TaskDTO } from './room_mutations'

export type PatientDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
}

export type PatientWithTasksNumberDTO = {
  id: string,
  name: string,
  tasksUnscheduled: number,
  tasksInProgress: number,
  tasksDone: number
}
