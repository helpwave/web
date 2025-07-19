import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import type { PropertySubjectType } from '../../types/properties/property'
import type {
  PropertyViewRuleFilterUpdate
} from '../../service/properties/PropertyViewSourceService'
import {
  PropertyViewSourceService
} from '../../service/properties/PropertyViewSourceService'

export const useUpdatePropertyViewRuleRequest = (subjectType: PropertySubjectType, wardId?: string, options?: UseMutationOptions<boolean, unknown, PropertyViewRuleFilterUpdate>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (update: PropertyViewRuleFilterUpdate) => {
      return await PropertyViewSourceService.update(update, subjectType, wardId)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.properties]).catch(console.error)
    }
  })
}
