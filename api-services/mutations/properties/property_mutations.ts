import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import type { Property, SelectOption, PropertySubjectType } from '../../types/properties/property'
import { PropertyService } from '../../service/properties/PropertyService'

export const usePropertyListQuery = (subjectType?: PropertySubjectType) => {
  return useQuery({
    queryKey: [QueryKeys.properties, subjectType ?? 'all'],
    queryFn: async (): Promise<Property[]> => {
      return await PropertyService.getList(subjectType)
    },
  })
}

export const usePropertyQuery = (id?: string) => {
  return useQuery({
    queryKey: [QueryKeys.properties, id],
    enabled: !!id,
    queryFn: async (): Promise<Property> => {
      return await PropertyService.get(id!)
    },
  })
}

export const usePropertyCreateMutation = (options?: UseMutationOptions<Property, unknown, Property>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (property: Property) => {
      return await PropertyService.create(property)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.properties]).catch(console.error)
    }
  })
}

export type PropertySelectDataUpdate = {
  add: SelectOption[],
  update: SelectOption[],
  remove: string[],
}

export type PropertyUpdateType = {
  property: Property,
  selectUpdate?: PropertySelectDataUpdate,
}

export const usePropertyUpdateMutation = (options?: UseMutationOptions<boolean, unknown, PropertyUpdateType>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (props) => {
      return await PropertyService.update(props)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.properties]).catch(console.error)
    }
  })
}
