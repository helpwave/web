import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { WardDetailDTO, WardMinimalDTO } from '../../types/tasks/wards'
import { QueryKeys } from '../query_keys'
import { WardService } from '../../service/tasks/WardService'

export const useWardQuery = (id: string) => useQuery({
  queryKey: [QueryKeys.wards, id],
  enabled: !!id,
  queryFn: async (): Promise<WardMinimalDTO> => {
    return await WardService.get(id)
  }
})

export const useWardOverviewsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.wards],
    queryFn: async () => {
      return await WardService.getWardOverviews()
    }
  })
}

export const useWardDetailsQuery = (wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.wards, wardId],
    enabled: !!wardId,
    queryFn: async (): Promise<WardDetailDTO> => {
      return await WardService.getDetails(wardId!)
    }
  })
}

export const useWardCreateMutation = (options?: UseMutationOptions<WardMinimalDTO, unknown, WardMinimalDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (ward: WardMinimalDTO) => {
      return await WardService.create(ward)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        return options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

export const useWardUpdateMutation = (options?: UseMutationOptions<boolean, unknown, WardMinimalDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (ward: WardMinimalDTO) => {
      return await WardService.update(ward)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        return options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

export const useWardDeleteMutation = (options?: UseMutationOptions<boolean, unknown, string>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (wardId: string) => {
      return await WardService.delete(wardId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        return options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}
