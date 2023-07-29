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

export type BedDTO = {
  id: string,
  index: number,
  patient?: PatientDTO
}

export const emptyBed: BedDTO = {
  id: '',
  index: 0,
  patient: undefined
}

export type BedWithPatientWithTasksNumberDTO = {
  id: string,
  index: number,
  patient?: PatientWithTasksNumberDTO
}

export const emptyBedWithPatientWithTasksNumber: BedWithPatientWithTasksNumberDTO = {
  id: '',
  index: 0,
  patient: undefined
}

export type BedMinimalDTO = {
  id: string,
  index: number
}

// TODO use bed minimal later
export type BedWithMinimalPatientDTO = {
  id: string,
  name: string,
  patient?: PatientMinimalDTO
}

export type BedWithRoomID = {
  id: string,
  roomID: string
}

export type BedWithPatientID = {
  id: string,
  patientID: string
}

export const bedQueryKey = 'beds'

export const useBedQuery = (bedID: string | undefined) => {
  return useQuery({
    queryKey: [bedQueryKey],
    enabled: !!bedID,
    queryFn: async () => {
      const req = new GetBedRequest()
      if (bedID) {
        req.setId(bedID)
      }
      const res = await bedService.getBed(req, getAuthenticatedGrpcMetadata())

      const bed: BedWithRoomID = {
        id: res.getId(),
        roomID: res.getRoomId()
      }

      return bed
    },
  })
}

export const useBedCreateMutation = (callback: (bed: BedMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomID: string) => {
      const req = new CreateBedRequest()
      req.setRoomId(roomID)
      const res = await bedService.createBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.log('error in BedCreate')
      }

      const bed: BedMinimalDTO = {
        id: res.getId(),
        index: 0 // TODO update later
      }
      callback(bed)
      return bed
    },
    onSuccess: () => {
      queryClient.refetchQueries([bedService]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey, wardOverviewsQueryKey]).then()
    },
  })
}

export const useBedUpdateMutation = (callback: () => void = noop, roomID?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bedID: string) => {
      const req = new UpdateBedRequest()
      req.setId(bedID)
      if (roomID) {
        req.setRoomId(roomID)
      }

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
    mutationFn: async (bedID: string) => {
      const req = new DeleteBedRequest()
      req.setId(bedID)

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
