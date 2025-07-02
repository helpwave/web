import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateBedRequest,
  DeleteBedRequest,
  GetBedRequest,
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

export const useBedCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bed: BedWithRoomId) => {
      const req = new CreateBedRequest()
      req.setRoomId(bed.roomId)
      req.setName(bed.name)
      const res = await APIServices.bed.createBed(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in BedCreate')
      }

      return { id: res.getId(), name: bed.name }
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.beds]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.wards]).catch(console.error)
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
      queryClient.refetchQueries([APIServices.bed]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
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
      queryClient.refetchQueries([APIServices.bed]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.refetchQueries([QueryKeys.wards]).catch(console.error)
    },
  })
}
