import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateBedRequest,
  DeleteBedRequest,
  GetBedRequest,
  UpdateBedRequest
} from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_pb'
import { QueryKeys } from '../query_keys'
import { roomOverviewsQueryKey, roomsQueryKey } from './room_mutations'
import { wardsQueryKey } from './ward_mutations'

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
        console.log('error in BedCreate')
      }

      return { id: res.getId(), name: bed.name }
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.beds]).then()
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey]).then()
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
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
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
      queryClient.refetchQueries([roomsQueryKey, roomOverviewsQueryKey]).then()
      queryClient.refetchQueries([wardsQueryKey]).then()
    },
  })
}
