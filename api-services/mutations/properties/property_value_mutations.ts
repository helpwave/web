import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import type { PropertySubjectType } from '../../types/properties/property'
import type { AttachedProperty } from '../../types/properties/attached_property'
import type {
  AttachedPropertyMutationUpdate } from '../../service/properties/AttachedPropertyValueService'
import {
  AttachedPropertyValueService
} from '../../service/properties/AttachedPropertyValueService'

export const usePropertyWithValueListQuery = (subjectId: string | undefined, subjectType: PropertySubjectType, wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.properties, QueryKeys.attachedProperties, subjectId],
    enabled: !!subjectId,
    queryFn: async () => {
      return await AttachedPropertyValueService.get({ subjectId: subjectId!, subjectType, wardId })
    },
  })
}

/**
 * Mutation to insert or update a properties value for a properties attached to a subject
 */
export const useAttachPropertyMutation = <T extends AttachedProperty>(options?: UseMutationOptions<AttachedProperty, unknown, AttachedPropertyMutationUpdate<T>>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (update: AttachedPropertyMutationUpdate<T>) => {
      return await AttachedPropertyValueService.create(update)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.properties, QueryKeys.attachedProperties, data.subjectId]).catch(console.error)
    },
  })
}
