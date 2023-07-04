import type { TaskDTO } from './task_mutations'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreatePatientRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { patientService, getAuthenticatedGrpcMetadata } from '../utils/grpc'

export type PatientDTO = {
  id: string,
  note: string,
  humanReadableIdentifier: string,
  tasks: TaskDTO[]
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

const queryKey = 'patients'

export const useCreateMutation = (callback: (patient: PatientDTO) => void) => {
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new CreatePatientRequest()
      req.setNotes(patient.note)
      req.setNotes(patient.humanReadableIdentifier)

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
