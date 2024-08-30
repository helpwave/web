import { noop } from '@helpwave/common/util/noop'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AttachPropertyValueRequest,
  GetAttachedPropertyValuesRequest,
  TaskPropertyMatcher
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import {
  Date as ProtoDate
} from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import type { SubjectType, DisplayableAttachedProperty, AttachedProperty } from '@/mutations/property/common'
import {
  fieldTypeMapperFromGRPC,
  propertyQueryKey,
  propertyValuesQueryKey
} from '@/mutations/property/common'
import { getAuthenticatedGrpcMetadata, APIServices } from '@/utils/grpc'
import { GRPCConverter } from '@/mutations/util'

export const usePropertyWithValueListQuery = (subjectId: string | undefined, subjectType: SubjectType, wardId?: string) => {
  return useQuery({
    queryKey: [propertyQueryKey, propertyValuesQueryKey, subjectId],
    enabled: !!subjectId,
    queryFn: async () => {
      if (!subjectId) {
        return undefined
      }
      const req = new GetAttachedPropertyValuesRequest()
      const taskMatcher = new TaskPropertyMatcher()
      if (subjectType === 'task') {
        taskMatcher.setTaskId(subjectId)
        if (wardId) {
          taskMatcher.setWardId(wardId)
        }
      }
      req.setTaskMatcher(taskMatcher)

      if (subjectType === 'patient') {
        console.warn("PropertyWithValueListQuery: subjectType patient isn't supported in production yet.")
      }

      const res = await APIServices.propertyValues.getAttachedPropertyValues(req, getAuthenticatedGrpcMetadata())

      const results: DisplayableAttachedProperty[] = res.getValuesList().map(result => {
        const dateValue: ProtoDate | undefined = result.getDateValue()

        return {
          propertyId: result.getPropertyId(),
          subjectId,
          subjectType,
          name: result.getName(),
          description: result.getDescription(),
          fieldType: fieldTypeMapperFromGRPC(result.getFieldType()),
          value: {
            boolValue: result.getBoolValue() ?? false,
            dateValue: dateValue?.getDate() ? dateValue.getDate()!.toDate() : new Date(),
            numberValue: result.getNumberValue() ?? 0,
            singleSelectValue: result.getSelectValue() ?? '',
            dateTimeValue: result.getDateTimeValue()?.toDate() ?? new Date(),
            textValue: result.getTextValue() ?? '',
            multiSelectValue: [], // TODO update this when implemented on API
          }
        }
      })

      return results
    },
  })
}

/**
 * Mutation to insert or update a property value for a property attached to a subject
 */
export const useAttachedPropertyMutation = <T extends AttachedProperty>(callback: (property: T) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: T) => {
      const req = new AttachPropertyValueRequest()

      req.setPropertyId(property.propertyId)
      req.setSubjectId(property.subjectId)
      req.setTextValue(property.value.textValue)
      req.setNumberValue(property.value.numberValue)
      req.setBoolValue(property.value.boolValue)
      req.setDateValue(new ProtoDate().setDate(GRPCConverter.dateToTimestamp(property.value.dateValue)))
      req.setDateTimeValue(GRPCConverter.dateToTimestamp(property.value.dateTimeValue))
      req.setSelectValue(property.value.singleSelectValue)

      await APIServices.propertyValues.attachPropertyValue(req, getAuthenticatedGrpcMetadata())

      const newProperty: T = {
        ...property,
      }

      callback(newProperty)
      return newProperty
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([propertyQueryKey, propertyValuesQueryKey, data.subjectId]).then()
    },
  })
}
