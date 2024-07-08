import { noop } from '@helpwave/common/util/noop'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  GetAttachedPropertyValuesRequest,
  TaskPropertyMatcher
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import type { SubjectType, AttachedProperty } from '@/mutations/property/common'
import { fieldTypeMapperFromGRPC, propertyQueryKey } from '@/mutations/property/common'
import { propertyValueService } from '@/utils/grpc'

export const usePropertyWithValueListQuery = (id: string | undefined, subjectType: SubjectType) => {
  return useQuery({
    queryKey: [propertyQueryKey, id, subjectType],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        return undefined
      }
      // TODO backend request here
      const req = new GetAttachedPropertyValuesRequest()
      const taskMatcher = new TaskPropertyMatcher()
      switch (subjectType) {
        case 'task':
          taskMatcher.setTaskId(id)
          break
        // TODO this should be ward
        case 'patient':
          taskMatcher.setWardId(id)
          break
      }
      req.setTaskMatcher(taskMatcher)

      const res = await propertyValueService.getAttachedPropertyValues(req)

      const results: AttachedProperty[] = res.getValuesList().map(result => {
        const dateValue = result.getDateValue()

        return {
          propertyId: result.getPropertyId(),
          name: result.getName(),
          description: result.getDescription(),
          subjectType,
          fieldType: fieldTypeMapperFromGRPC(result.getFieldType()),
          value: {
            boolValue: result.getBoolValue(),
            dateValue: dateValue ? new Date(dateValue.getYear(), dateValue.getMonth(), dateValue.getDay()) : undefined,
            numberValue: result.getNumberValue(),
            selectValue: result.getSelectValue(),
            dataTimeValue: result.getDateTimeValue()?.toDate(),
            textValue: result.getTextValue(),
          }
        }
      })

      return results
    },
  })
}

export const usePropertyWithValueCreateMutation = (callback: (property: PropertyWithValue) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: PropertyWithValue) => {
      // TODO backend request here
      const newProperty: PropertyWithValue = {
        ...property,
        id: Math.random().toString()
      }
      propertiesWithValuesExample.push(newProperty)

      callback(newProperty)
      return newProperty.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyWithValueQueryKey]).then()
    },
  })
}

export const usePropertyWithValueUpdateMutation = (callback: (property: PropertyWithValue) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: PropertyWithValue) => {
      // TODO backend request here
      propertiesWithValuesExample = propertiesWithValuesExample.map(value => value.id === property.id ? property : value)

      callback(property)
      return property
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyWithValueQueryKey]).then()
    },
  })
}

export const usePropertyWithValueDeleteMutation = (property: PropertyWithValue, callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: PropertyWithValue) => {
      // TODO backend request here
      propertiesWithValuesExample = propertiesWithValuesExample.filter(value => value.id !== property.id)

      callback()
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyWithValueQueryKey]).then()
    },
  })
}
