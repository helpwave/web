import type { TaskDTO, TaskMinimalDTO } from './task_mutations'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreatePatientRequest,
  DischargePatientRequest, GetPatientDetailsRequest,
  UpdatePatientRequest
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
