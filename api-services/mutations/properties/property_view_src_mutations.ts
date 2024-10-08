import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FilterUpdate,
  UpdatePropertyViewRuleRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_views_svc_pb'
import {
  PatientPropertyMatcher,
  TaskPropertyMatcher
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import { QueryKeys } from '../query_keys'
import type { SubjectType } from '../../types/properties/property'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

type PropertyViewRuleFilterUpdate = {
  subjectId: string,
  appendToAlwaysInclude?: string[],
  removeFromAlwaysInclude?: string[],
  appendToDontAlwaysInclude?: string[],
  removeFromDontAlwaysInclude?: string[]
}

export const useUpdatePropertyViewRuleRequest = (subjectType: SubjectType, wardId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (update: PropertyViewRuleFilterUpdate) => {
      const req = new UpdatePropertyViewRuleRequest()
      if (subjectType === 'patient') {
        const matcher = new PatientPropertyMatcher().setPatientId(update.subjectId)
        if (wardId) {
          matcher.setWardId(wardId)
        }
        req.setPatientMatcher(matcher)
      }
      if (subjectType === 'task') {
        const matcher = new TaskPropertyMatcher().setTaskId(update.subjectId)
        if (wardId) {
          matcher.setWardId(wardId)
        }
        req.setTaskMatcher(matcher)
      }

      req.setFilterUpdate(new FilterUpdate()
        .setAppendToAlwaysIncludeList(update.appendToAlwaysInclude ?? [])
        .setRemoveFromAlwaysIncludeList(update.removeFromAlwaysInclude ?? [])
        .setAppendToDontAlwaysIncludeList(update.removeFromAlwaysInclude ?? [])
        .setRemoveFromDontAlwaysIncludeList(update.removeFromDontAlwaysInclude ?? [])
      )

      await APIServices.propertyViewSource.updatePropertyViewRule(req, getAuthenticatedGrpcMetadata())
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.properties]).then()
    }
  })
}
