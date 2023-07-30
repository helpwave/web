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
  GetPatientListRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { patientService, getAuthenticatedGrpcMetadata } from '../utils/grpc'
import type { BedDTO } from './bed_mutations'
import { emptyBed } from './bed_mutations'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'
import { noop } from '@helpwave/common/util/noop'

export type PatientDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskMinimalDTO[]
}

export const emptyPatient: PatientDTO = {
  id: '',
  note: '',
  humanReadableIdentifier: '',
  tasks: []
}

export type PatientWithTasksNumberDTO = {
  id: string,
  name: string,
  tasksUnscheduled: number,
  tasksInProgress: number,
  tasksDone: number
}

export type PatientCompleteDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
}

export type PatientMinimalDTO = {
  id: string,
  name: string
}

export const emptyPatientMinimal = {
  id: '',
  human_readable_identifier: ''
}

export type PatientWithBedAndRoomDTO = {
  id: string,
  name: string,
  room: { id: string, name: string },
  bed: { id: string, name: string }
}

export type PatientListDTO = {
  active: PatientWithBedAndRoomDTO[],
  unassigned: PatientMinimalDTO[],
  discharged: PatientMinimalDTO[]
}

export type PatientWithBedIDDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  bedID: string
}

export type PatientDetailsDTO = {
  id: string,
  name: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
}

export const emptyPatientDetails = {
  id: '',
  name: '',
  note: '',
  humanReadableIdentifier: '',
  tasks: []
}

const patientsQueryKey = 'patients'

export const usePatientDetailsQuery = (callback: (patient: PatientDetailsDTO) => void, patientID:string | undefined) => {
  return useQuery({
    queryKey: [patientsQueryKey, patientID],
    enabled: !!patientID,
    queryFn: async () => {
      if (!patientID) {
        return
      }

      const req = new GetPatientDetailsRequest()
      req.setId(patientID)

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
        humanReadableIdentifier: res.getHumanReadableIdentifier(),
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

export const usePatientsByWardQuery = (wardID: string) => {
  return useQuery({
    queryKey: [patientsQueryKey, 'details'],
    queryFn: async () => {
      const req = new GetPatientsByWardRequest()
      req.setWardId(wardID)
      const res = await patientService.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

      const patients: PatientWithBedIDDTO[] = res.getPatientsList().map((patient) => ({
        id: patient.getId(),
        humanReadableIdentifier: patient.getHumanReadableIdentifier(),
        note: patient.getNotes(),
        bedID: patient.getBedId(),
      }))
      patients[0].note = ''
      return patients
    }
  })
}

export const usePatientListQuery = (organisationID: string) => {
  return useQuery({
    queryKey: [patientsQueryKey, 'patientList'],
    queryFn: async () => {
      const req = new GetPatientListRequest()
      req.setOrganisationId(organisationID)
      const res = await patientService.getPatientList(req, getAuthenticatedGrpcMetadata())

      const patientList: PatientListDTO = {
        active: res.getActiveList().map(value => {
          const room = value.getRoom()
          const bed = value.getBed()

          if (!room) {
            console.error('no room for active patient in PatientList')
          }

          if (!bed) {
            console.error('no room for active patient in PatientList')
          }
          return ({
            id: value.getId(),
            name: value.getHumanReadableIdentifier(),
            bed: { id: bed?.getId() ?? '', name: bed?.getName() ?? '' },
            room: { id: room?.getId() ?? '', name: room?.getName() ?? '' }
          })
        }),
        discharged: res.getDischargedPatientsList().map(value => ({
          id: value.getId(),
          name: value.getHumanReadableIdentifier(),
        })),
        unassigned: res.getUnassignedPatientsList().map(value => ({
          id: value.getId(),
          name: value.getHumanReadableIdentifier(),
        }))
      }

      return patientList
    }
  })
}

export const usePatientCreateMutation = (callback: (patient: PatientDTO) => void) => {
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new CreatePatientRequest()
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.humanReadableIdentifier)
      const res = await patientService.createPatient(req, getAuthenticatedGrpcMetadata())
      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('create room failed')
      }

      patient = { ...patient, id: res.getId() }

      callback(patient)
      return patient
    },
  })
}

export const usePatientUpdateMutation = (callback: (patient: PatientDTO) => void) => {
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new UpdatePatientRequest()
      req.setId(patient.id)
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.humanReadableIdentifier)

      await patientService.updatePatient(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      patient = { ...patient }

      callback(patient)
      return patient
    },
  })
}

export const usePatientDischargeMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientID: string) => {
      const req = new DischargePatientRequest()
      req.setId(patientID)

      const res = await patientService.dischargePatient(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in PatientDischarge')
      }

      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).catch(reason => console.log(reason))
      callback()
      return res.toObject()
    },
  })
}

export const useAssignBedMutation = (callback: (bed: BedDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedDTO) => {
      if (!bed.patient) {
        console.error('cannot use bed without an assigned patient to make the assign request')
        return { ...emptyBed }
      }
      const req = new AssignBedRequest()
      req.setId(bed.patient.id)
      req.setBedId(bed.id)

      const res = await patientService.assignBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('assign bed request failed')
      }

      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      callback(bed)
      return bed
    },
  })
}

export const useUnassignMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientID: string) => {
      const req = new UnassignBedRequest()
      req.setId(patientID)

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
