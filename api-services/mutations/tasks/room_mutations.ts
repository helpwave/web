import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RoomMinimalDTO } from '../../types/tasks/room'
import { QueryKeys } from '../query_keys'
import { RoomService } from '../../service/tasks/RoomService'

export const useRoomQuery = (roomId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.rooms, roomId],
    enabled: !!roomId,
    queryFn: async () => {
      return await RoomService.get(roomId!)
    },
  })
}

export const roomOverviewsQueryKey = 'roomOverview'
export const useRoomOverviewsQuery = (wardId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.rooms, roomOverviewsQueryKey],
    enabled: !!wardId,
    queryFn: async () => {
      return await RoomService.getWardOverview(wardId!)
    },
  })
}

export const useRoomCreateMutation = (options?: UseMutationOptions<RoomMinimalDTO, unknown, RoomMinimalDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (room: RoomMinimalDTO) => {
      return await RoomService.create(room)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

export const useRoomUpdateMutation = (options?: UseMutationOptions<boolean, unknown, RoomMinimalDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (room: RoomMinimalDTO) => {
      return await RoomService.update(room)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(console.error)
    },
  })
}

export const useRoomDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (roomId: string) => {
      return await RoomService.delete(roomId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}
