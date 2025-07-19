import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import type { BedWithRoomId } from '../../types/tasks/bed'
import { roomOverviewsQueryKey } from './room_mutations'
import { BedService } from '../../service/tasks/BedService'

export const useBedQuery = (id?: string) => {
  return useQuery({
    queryKey: [QueryKeys.beds],
    enabled: !!id,
    queryFn: async () => {
      return await BedService.get(id!)
    },
  })
}

export const useBedCreateMutation = (options?: UseMutationOptions<BedWithRoomId, unknown, BedWithRoomId>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (bed: BedWithRoomId) => {
      return await BedService.create(bed)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.beds]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    },
  })
}

export const useBedUpdateMutation = (options?: UseMutationOptions<boolean, unknown, BedWithRoomId>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (bed: BedWithRoomId) => {
      return await BedService.update(bed)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([APIServices.bed]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
    },
  })
}

export const useBedDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (bedId: string) => {
      return await BedService.delete(bedId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([APIServices.bed]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    },
  })
}
