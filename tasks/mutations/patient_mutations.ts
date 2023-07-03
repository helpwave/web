import {
  CreatePatientRequest,
  DischargePatientRequest,
  GetPatientsByWardRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedGrpcMetadata, patientService } from '../utils/grpc'

const queryKey = 'patients'

export type PatientDTO = {
  id: string,
  human_readable_identifier: string,
  notes: string,
  bed_id: string
}

export const usePatientListQuery = () => {
  return useQuery({
    queryKey: [queryKey, 'details'],
    queryFn: async () => {
      const req = new GetPatientsByWardRequest()
      const res = await patientService.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

      const patients: PatientDTO[] = res.getPatientsList().map((patient) => ({
        id: patient.getId(),
        human_readable_identifier: patient.getHumanReadableIdentifier(),
        notes: patient.getNotes(),
        bed_id: patient.getBedId(),
      }))

      return patients
    }
  })
}
