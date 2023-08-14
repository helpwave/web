import type { PatientDTO, PatientWithTasksNumberDTO, PatientMinimalDTO } from './patient_mutations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bedService, getAuthenticatedGrpcMetadata } from '../utils/grpc'
import {
  CreateBedRequest, DeleteBedRequest,
  GetBedRequest,
  UpdateBedRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/bed_svc_pb'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'
import { noop } from '@helpwave/common/util/noop'
import { wardOverviewsQueryKey, wardsQueryKey } from './ward_mutations'

export type BedMinimalDTO = {
  id: string,
  name: string
}

export type BedDTO = BedMinimalDTO & {
  patient?: PatientDTO
}

export const emptyBed: BedDTO = {
  id: '',
  name: '',
  patient: undefined
}

export type BedWithPatientWithTasksNumberDTO = BedMinimalDTO & {
  patient?: PatientWithTasksNumberDTO
}

export const emptyBedWithPatientWithTasksNumber: BedWithPatientWithTasksNumberDTO = {
  id: '',
  name: '',
  patient: undefined
}

export type BedWithRoomId = BedMinimalDTO & {
  roomId: string
}

export type BedWithMinimalPatientDTO = BedMinimalDTO & {
  patient?: PatientMinimalDTO
}

export type BedWithPatientId = {
  id: string,
  patientId: string
}

export const bedQueryKey = 'beds'

export const useBedQuery = (bedId: string | undefined) => {
  return useQuery({
    queryKey: [bedQueryKey],
    enabled: !!bedId,
    queryFn: async () => {
      const req = new GetBedRequest()
      if (bedId) {
        req.setId(bedId)
      }
      const res = await bedService.getBed(req, getAuthenticatedGrpcMetadata())

      const bed: BedWithRoomId = {
        id: res.getId(),
        name: res.getName(),
        roomId: res.getRoomId()
      }

      return bed
    },
  })
}

export const useBedCreateMutation = (callback: (bed: BedMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithRoomId) => {
      const req = new CreateBedRequest()
      req.setRoomId(bed.roomId)
      req.setName(bed.name)
      const res = await bedService.createBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.log('error in BedCreate')
      }

      const newBed: BedMinimalDTO = {
        id: res.getId(),
        name: res.getName()
      }
      callback(newBed)
      return newBed
    },
    onSuccess: () => {
      queryClient.refetchQueries([bedService]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey, wardOverviewsQueryKey]).then()
    },
  })
}

export const useBedUpdateMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithRoomId) => {
      const req = new UpdateBedRequest()
      req.setId(bed.id)
      req.setName(bed.name)
      req.setRoomId(bed.roomId)

      const res = await bedService.updateBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.log('error in BedUpdate')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([bedService]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
    },
  })
}

export const useBedDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bedId: string) => {
      const req = new DeleteBedRequest()
      req.setId(bedId)

      const res = await bedService.deleteBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.log('error in BedDelete')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries([bedService]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey, wardOverviewsQueryKey]).then()
    },
  })
}
