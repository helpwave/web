import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AssignBedRequest,
  CreatePatientRequest,
  DischargePatientRequest,
  GetPatientAssignmentByWardRequest,
  GetPatientDetailsRequest,
  GetPatientListRequest,
  GetPatientsByWardRequest,
  GetRecentPatientsRequest,
  ReadmitPatientRequest,
  UnassignBedRequest,
  UpdatePatientRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_pb'
import { noop } from '@helpwave/hightide'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type {
  PatientDTO, PatientDetailsDTO,
  PatientListDTO,
  PatientMinimalDTO,
  PatientWithBedIdDTO,
  RecentPatientDTO
} from '../../types/tasks/patient'
import { GRPCConverter } from '../../util/util'
import { QueryKeys } from '../query_keys'
import type { BedWithPatientId } from '../../types/tasks/bed'
import type { RoomWithMinimalBedAndPatient } from '../../types/tasks/room'
import { roomOverviewsQueryKey } from './room_mutations'

export const usePatientDetailsQuery = (patientId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, patientId],
    enabled: !!patientId,
    queryFn: async () => {
      if (!patientId) {
        return
      }

      const req = new GetPatientDetailsRequest()
      req.setId(patientId)

      const res = await APIServices.patient.getPatientDetails(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        throw new Error('create room failed')
      }

      const patient: PatientDetailsDTO = {
        id: res.getId(),
        note: res.getNotes(),
        name: res.getHumanReadableIdentifier(),
        discharged: res.getIsDischarged(),
        tasks: res.getTasksList().map(task => ({
          id: task.getId(),
          name: task.getName(),
          status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
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

      return patient
    },
  })
}

export const usePatientsByWardQuery = (wardId: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, 'details'],
    queryFn: async () => {
      const req = new GetPatientsByWardRequest()
      req.setWardId(wardId)
      const res = await APIServices.patient.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

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
    queryKey: [QueryKeys.rooms, 'patientAssignments'],
    enabled: !!wardId,
    queryFn: async () => {
      const req = new GetPatientAssignmentByWardRequest()
      req.setWardId(wardId)
      const res = await APIServices.patient.getPatientAssignmentByWard(req, getAuthenticatedGrpcMetadata())

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

export const usePatientListQuery = (wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, 'patientList', wardId],
    queryFn: async () => {
      const req = new GetPatientListRequest()
      if (wardId) {
        req.setWardId(wardId)
      }
      const res = await APIServices.patient.getPatientList(req, getAuthenticatedGrpcMetadata())

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
            bed: {
              id: bed?.getId() ?? '',
              name: bed?.getName() ?? ''
            },
            room: {
              id: room?.getId() ?? '',
              name: room?.getName() ?? '',
              wardId: room?.getWardId() ?? ''
            }
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

export const useRecentPatientsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.patients],
    queryFn: async () => {
      const req = new GetRecentPatientsRequest()
      const res = await APIServices.patient.getRecentPatients(req, getAuthenticatedGrpcMetadata())

      const patients: RecentPatientDTO[] = []
      for (const patient of res.getRecentPatientsList()) {
        const room = patient.getRoom()
        const bed = patient.getBed()
        const wardId: string | undefined = undefined// TODO get wardId from query once implemented
        if (room) {
          // wardId = roomByQuery.data.id
        }

        patients.push({
          id: patient.getId(),
          name: patient.getHumanReadableIdentifier(),
          wardId,
          bed: bed ? { id: bed.getId(), name: bed.getName() } : undefined,
          room: room ? { id: room.getId(), name: room.getId() } : undefined
        })
      }

      return patients
    }
  })
}

export const usePatientCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new CreatePatientRequest()
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.name)
      const res = await APIServices.patient.createPatient(req, getAuthenticatedGrpcMetadata())

      const id = res.getId()

      if (!id) {
        throw new Error('create room failed')
      }

      return { ...patient, id }
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms]).catch(reason => console.error(reason))
      queryClient.refetchQueries([QueryKeys.patients]).catch(reason => console.error(reason))
    }
  })
}

export const usePatientUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientDTO) => {
      const req = new UpdatePatientRequest()
      req.setId(patient.id)
      req.setNotes(patient.note)
      req.setHumanReadableIdentifier(patient.name)

      const res = await APIServices.patient.updatePatient(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('error in PatientUpdate')
      }

      return patient
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.patients]).catch(reason => console.error(reason))
      queryClient.refetchQueries([QueryKeys.rooms]).catch(reason => console.error(reason))
    }
  })
}

export const useAssignBedMutation = (callback: (bed: BedWithPatientId) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithPatientId) => {
      const req = new AssignBedRequest()
      req.setId(bed.patientId)
      req.setBedId(bed.id)

      const res = await APIServices.patient.assignBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('assign bed request failed')
      }

      callback(bed)
      return bed
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}

export const useUnassignMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientId: string) => {
      const req = new UnassignBedRequest()
      req.setId(patientId)

      const res = await APIServices.patient.unassignBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('assign bed request failed')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}

/* TODO wait for backend decision on this
export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientId: string) => {
      const req = new DeletePatientRequest()
      req.setId(patientId)

      const res = await APIServices.patient.deletePatient(req, getAuthenticatedGrpcMetadata())

      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([QueryKeys.patients]).then()
    }
  })
}
 */

export const usePatientDischargeMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientId: string) => {
      const req = new DischargePatientRequest()
      req.setId(patientId)

      const res = await APIServices.patient.dischargePatient(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('error in PatientDischarge')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(reason => console.error(reason))
      queryClient.refetchQueries([QueryKeys.patients]).catch(reason => console.error(reason))
    }
  })
}

export const useReadmitPatientMutation = (callback: (patientId: string) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patientId: string) => {
      const req = new ReadmitPatientRequest()
      req.setPatientId(patientId)

      const res = await APIServices.patient.readmitPatient(req, getAuthenticatedGrpcMetadata())

      callback(patientId)
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}
