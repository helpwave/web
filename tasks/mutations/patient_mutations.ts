import type { TaskDTO, TaskMinimalDTO } from './task_mutations'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreatePatientRequest,
  DischargePatientRequest, GetPatientDetailsRequest,
  UpdatePatientRequest, GetPatientsByWardRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { patientService, getAuthenticatedGrpcMetadata } from '../utils/grpc'

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

const patientsQueryKey = 'patients'

export const usePatientQuery = (callback: (patient: PatientDTO) => void, patientID:string) => {
  return useQuery({
    queryKey: [patientsQueryKey],
    queryFn: async () => {
      const req = new GetPatientDetailsRequest()
      req.setId(patientID)

      const res = await patientService.getPatientDetails(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('create room failed')
      }
      const patient: PatientDTO = {
        id: res.getId(),
        note: res.getNotes(),
        humanReadableIdentifier: res.getHumanReadableIdentifier(),
        tasks: res.getTasksList().map(task => ({
          id: task.getId(),
          name: task.getName(),
          status: task.getStatus(),
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

      const patients: PatientDTO[] = res.getPatientsList().map((patient) => ({
        id: patient.getId(),
        human_readable_identifier: patient.getHumanReadableIdentifier(),
        notes: patient.getNotes(),
        bed_id: patient.getBedId(),
      }))
      patients[0].notes = ''
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

      return queryClient.getQueryData<PatientListDTO>([queryKey, 'patientList'])
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
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new DischargePatientRequest()
      req.setId(patient.id)

      const res = await patientService.dischargePatient(req, getAuthenticatedGrpcMetadata())

      // TODO some check whether request was successful

      callback()
      return res.toObject()
    },
  })
}
