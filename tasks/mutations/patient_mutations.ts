import type { TaskDTO, TaskMinimalDTO } from './task_mutations'
import { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreatePatientRequest,
  DischargePatientRequest,
  GetPatientDetailsRequest,
  UpdatePatientRequest,
  GetPatientsByWardRequest,
  AssignBedRequest,
  UnassignBedRequest,
  GetPatientDetailsResponse,
  GetPatientAssignmentByWardRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { patientService, getAuthenticatedGrpcMetadata } from '../utils/grpc'
import type { BedWithPatientId } from './bed_mutations'
import type { RoomWithMinimalBedAndPatient } from './room_mutations'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'
import { noop } from '@helpwave/common/util/noop'

export type PatientMinimalDTO = {
  id: string,
  name: string
}

export type PatientDTO = PatientMinimalDTO & {
  note: string,
  tasks: TaskMinimalDTO[]
}

export const emptyPatient: PatientDTO = {
  id: '',
  note: '',
  name: '',
  tasks: []
}

export type PatientWithTasksNumberDTO = PatientMinimalDTO & {
  tasksUnscheduled: number,
  tasksInProgress: number,
  tasksDone: number
}

export type PatientCompleteDTO = PatientMinimalDTO & {
  note: string,
  tasks: TaskDTO[]
}

export const emptyPatientMinimal: PatientMinimalDTO = {
  id: '',
  name: ''
}

export type PatientWithBedAndRoomDTO = PatientMinimalDTO & {
  room: { id: string, name: string },
  bed: { id: string, name: string }
}

export type PatientListDTO = {
  active: PatientWithBedAndRoomDTO[],
  unassigned: PatientMinimalDTO[],
  discharged: PatientMinimalDTO[]
}

export type PatientWithBedIdDTO = PatientMinimalDTO &{
  note: string,
  bedId: string
}

export type PatientDetailsDTO = PatientMinimalDTO &{
  note: string,
  tasks: TaskDTO[]
}

export const emptyPatientDetails: PatientDetailsDTO = {
  id: '',
  name: '',
  note: '',
  tasks: []
}

const patientsQueryKey = 'patients'

export const usePatientDetailsQuery = (callback: (patient: PatientDetailsDTO) => void, patientId: string | undefined) => {
  return useQuery({
    queryKey: [patientsQueryKey, patientId],
    enabled: !!patientId,
    queryFn: async () => {
      if (!patientId) {
        return
      }

      const req = new GetPatientDetailsRequest()
      req.setId(patientId)

      const res = await patientService.getPatientDetails(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('create room failed')
      }

      const statusMap = {
        [GetPatientDetailsResponse.TaskStatus.TASK_STATUS_UNSPECIFIED]: TaskStatus.TASK_STATUS_UNSPECIFIED,
        [GetPatientDetailsResponse.TaskStatus.TASK_STATUS_TODO]: TaskStatus.TASK_STATUS_TODO,
        [GetPatientDetailsResponse.TaskStatus.TASK_STATUS_IN_PROGRESS]: TaskStatus.TASK_STATUS_IN_PROGRESS,
        [GetPatientDetailsResponse.TaskStatus.TASK_STATUS_DONE]: TaskStatus.TASK_STATUS_DONE,
      }
      const patient: PatientDetailsDTO = {
        id: res.getId(),
        note: res.getNotes(),
        name: res.getName(),
        tasks: res.getTasksList().map(task => ({
          id: task.getId(),
          name: task.getName(),
          status: statusMap[task.getStatus()],
          notes: task.getDescription(),
          isPublicVisible: task.getPublic(),
          assignee: task.getAssignedUserId(),
          dueDate: new Date(), // TODO replace later
          subtasks: task.getSubtasksList().map(subtask => ({
            id: subtask.getId(),
            name: subtask.getName(),
            isDone: subtask.getDone()
          }))
        }))
      }

      callback(patient)
      return patient
    },
  })
}

export const usePatientsByWardQuery = (wardId: string) => {
  return useQuery({
    queryKey: [patientsQueryKey, 'details'],
    queryFn: async () => {
      const req = new GetPatientsByWardRequest()
      req.setWardId(wardId)
      const res = await patientService.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

      const patients: PatientWithBedIdDTO[] = res.getPatientsList().map((patient) => ({
        id: patient.getId(),
        name: patient.getHumanReadableIdentifier(),
        note: patient.getNotes(),
        bedId: patient.getBedId(),
      }))

      return patients
    }
  })
}

export const usePatientAssignmentByWardQuery = (wardId: string) => {
  return useQuery({
    queryKey: [roomsQueryKey, 'patientAssignments'],
    queryFn: async () => {
      const req = new GetPatientAssignmentByWardRequest()
      req.setWardId(wardId)
      const res = await patientService.getPatientAssignmentByWard(req, getAuthenticatedGrpcMetadata())

      const rooms: RoomWithMinimalBedAndPatient[] = res.getRoomsList().map((room) => ({
        id: room.getId(),
        name: room.getName(),
        beds: room.getBedsList().map(bed => {
          let patient: PatientMinimalDTO | undefined
          const objectPatient = bed.getPatient()
          if (objectPatient) {
            patient = {
              id: objectPatient.getId(),
              name: objectPatient.getName()
            }
          }
          return {
            id: bed.getId(),
            name: bed.getName(),
            patient
          }
        })
      }))

      return rooms
    }
  })
}

// TODO remove this comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePatientListQuery = (wardId: string) => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: [patientsQueryKey, 'patientList'],
    queryFn: async () => {
      // TODO do grpc request

      return queryClient.getQueryData<PatientListDTO>([patientsQueryKey, 'patientList'])
    },
    initialData: {
      active: [
      ],
      unassigned: [
      ],
      discharged: [
      ]
    }
  })
}

export const usePatientCreateMutation = (callback: (patient: PatientDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new CreatePatientRequest()
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.name)
      const res = await patientService.createPatient(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        console.error('create room failed')
      }

      patient = { ...patient, id: res.getId() }

      callback(patient)
      return patient
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey]).catch(reason => console.log(reason))
    }
  })
}

export const usePatientUpdateMutation = (callback: (patient: PatientDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new UpdatePatientRequest()
      req.setId(patient.id)
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.name)

      const res = await patientService.updatePatient(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in PatientUpdate')
      }

      patient = { ...patient }

      callback(patient)
      return patient
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey]).catch(reason => console.log(reason))
    }
  })
}

export const usePatientDischargeMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new DischargePatientRequest()
      req.setId(patient.id)

      const res = await patientService.dischargePatient(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).catch(reason => console.log(reason))
      callback()
      return res.toObject()
    },
  })
}

export const useAssignBedMutation = (callback: (bed: BedWithPatientId) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithPatientId) => {
      const req = new AssignBedRequest()
      req.setId(bed.patientId)
      req.setBedId(bed.id)

      const res = await patientService.assignBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('assign bed request failed')
      }

      callback(bed)
      return bed
    },
    onSuccess: () => {
      queryClient.refetchQueries([roomsQueryKey]).then()
      queryClient.refetchQueries([patientsQueryKey]).then()
    }
  })
}

export const useUnassignMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientId: string) => {
      const req = new UnassignBedRequest()
      req.setId(patientId)

      const res = await patientService.unassignBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('assign bed request failed')
      }

      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback()
      return res.toObject()
    },
  })
}
