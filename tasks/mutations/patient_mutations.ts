import type { TaskDTO, TaskMinimalDTO } from './task_mutations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreatePatientRequest,
  DischargePatientRequest, GetPatientDetailsRequest,
  UpdatePatientRequest, GetPatientsByWardRequest, AssignBedRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { patientService, getAuthenticatedGrpcMetadata } from '../utils/grpc'
import type { BedDTO } from './bed_mutations'
import { emptyBed } from './bed_mutations'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'

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
  human_readable_identifier: string
}

export const emptyPatientMinimal = {
  id: '',
  human_readable_identifier: ''
}

export type PatientWithBedAndRoomDTO = {
  id: string,
  human_readable_identifier: string,
  room: { id: string, name: string },
  bed: { id: string, index: number }
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
    queryKey: [patientsQueryKey],
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
      const patient: PatientDetailsDTO = {
        id: res.getId(),
        note: res.getNotes(),
        name: res.getName(),
        humanReadableIdentifier: res.getHumanReadableIdentifier(),
        tasks: res.getTasksList().map(task => ({
          id: task.getId(),
          name: task.getName(),
          status: task.getStatus(),
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

// TODO remove this comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePatientListQuery = (wardID: string) => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: [patientsQueryKey, 'patientList'],
    queryFn: async () => {
      // TODO do grpc request

      return queryClient.getQueryData<PatientListDTO>([patientsQueryKey, 'patientList'])
    },
    initialData: {
      active: [
        {
          id: 'patient2',
          human_readable_identifier: 'Patient B',
          bed: { id: 'bed1', index: 1 },
          room: { id: 'room2', name: 'Room 2' },
        },
        {
          id: 'patient4',
          human_readable_identifier: 'Patient D',
          bed: { id: 'bed2', index: 2 },
          room: { id: 'room1', name: 'Room 1' },
        }
      ],
      unassigned: [
        {
          id: 'patient1',
          human_readable_identifier: 'Patient A',
        },
        {
          id: 'patient3',
          human_readable_identifier: 'Patient C',
        }
      ],
      discharged: [
        {
          id: 'patient5',
          human_readable_identifier: 'Patient E',
        }
      ]
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
