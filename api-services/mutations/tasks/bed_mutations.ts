import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateBedRequest,
  DeleteBedRequest,
  GetBedRequest, GetBedsRequest,
  UpdateBedRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/bed_svc_pb'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type { BedWithRoomId } from '../../types/tasks/bed'
import { roomOverviewsQueryKey } from './room_mutations'

export const useBedQuery = (bedId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.beds],
    enabled: !!bedId,
    queryFn: async () => {
      const req = new GetBedRequest()
      if (bedId) {
        req.setId(bedId)
      }
      const res = await APIServices.bed.getBed(req, getAuthenticatedGrpcMetadata())

      const bed: BedWithRoomId = {
        id: res.getId(),
        name: res.getName(),
        roomId: res.getRoomId()
      }

      return bed
    },
  })
}

export const useBedsQuery = (roomId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.beds, roomId ?? 'all'],
    queryFn: async () => {
      const req = new GetBedsRequest()
      if (roomId) {
        req.setRoomId(roomId)
      }
      const res = await APIServices.bed.getBeds(req, getAuthenticatedGrpcMetadata())

      const beds: BedWithRoomId[] = res.getBedsList().map(bed => ({
        id: bed.getId(),
        name: bed.getName(),
        roomId: bed.getRoomId()
      }))

      return beds
    },
  })
}

export const useBedCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithRoomId) => {
      const req = new CreateBedRequest()
      req.setRoomId(bed.roomId)
      req.setName(bed.name)
      const res = await APIServices.bed.createBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.log('error in BedCreate')
      }

      return { id: res.getId(), name: bed.name }
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.beds]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([QueryKeys.wards]).then()
    },
  })
}

export const useBedUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithRoomId) => {
      const req = new UpdateBedRequest()
      req.setId(bed.id)
      req.setName(bed.name)
      req.setRoomId(bed.roomId)

      const res = await APIServices.bed.updateBed(req, getAuthenticatedGrpcMetadata())

      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('error in BedUpdate')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries([APIServices.bed]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
    },
  })
}

export const useBedDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bedId: string) => {
      const req = new DeleteBedRequest()
      req.setId(bedId)

      const res = await APIServices.bed.deleteBed(req, getAuthenticatedGrpcMetadata())

      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('error in BedDelete')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries([APIServices.bed]).then()
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([QueryKeys.wards]).then()
    },
  })
}
