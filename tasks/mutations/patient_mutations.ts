import {
  GetPatientsByWardRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAuthenticatedGrpcMetadata, patientService } from '../utils/grpc'

const queryKey = 'patients'

export type PatientDTO = {
  id: string,
  human_readable_identifier: string,
  notes: string,
  bed_id: string
}

export type PatientWithBedAndRoomDTO = {
  id: string,
  human_readable_identifier: string,
  room: { id: string, name: string },
  bed: { id: string, index: number }
}

export type PatientMinimalDTO = {
  id: string,
  human_readable_identifier: string
}

export type PatientListDTO = {
  active: PatientWithBedAndRoomDTO[],
  unassigned: PatientMinimalDTO[],
  discharged: PatientMinimalDTO[]
}

export const usePatientsByWardQuery = (wardID: string) => {
  return useQuery({
    queryKey: [queryKey, 'details'],
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
    queryKey: [queryKey, 'patientList'],
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

// TODO implement and remove lint suppressions
export const useCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_: PatientDTO) => {
      // TODO do grpc request
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMutate: async (_: PatientDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousPatients = queryClient.getQueryData<PatientDTO[]>([queryKey])
      // TODO do optimistic update here
      queryClient.setQueryData<PatientDTO[]>([queryKey], (old) => old)
      return { previousPatients }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousPatients)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
