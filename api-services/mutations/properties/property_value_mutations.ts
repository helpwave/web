import { noop } from '@helpwave/common/util/noop'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AttachPropertyValueRequest,
  GetAttachedPropertyValuesRequest,
  TaskPropertyMatcher,
  PatientPropertyMatcher, GetAttachedPropertyValuesResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import {
  Date as ProtoDate
} from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import { ArrayUtil } from '@helpwave/common/util/array'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { QueryKeys } from '../query_keys'
import type { SubjectType, FieldType } from '../../types/properties/property'
import type { AttachedProperty, DisplayableAttachedProperty } from '../../types/properties/attached_property'
import { GRPCConverter } from '../../util/util'
import type { Update } from '../../types/update'
import { emptyPropertyValue } from '../../types/properties/attached_property'

export const usePropertyWithValueListQuery = (subjectId: string | undefined, subjectType: SubjectType, wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.properties, QueryKeys.attachedProperties, subjectId],
    enabled: !!subjectId,
    queryFn: async () => {
      if (!subjectId) {
        return undefined
      }
      const req = new GetAttachedPropertyValuesRequest()

      const taskMatcher = new TaskPropertyMatcher()
      const patientMatcher = new PatientPropertyMatcher()

      switch (subjectType) {
        case 'task':
          taskMatcher.setTaskId(subjectId)
          if (wardId) taskMatcher.setWardId(wardId)
          req.setTaskMatcher(taskMatcher)
          break
        case 'patient':
          patientMatcher.setPatientId(subjectId)
          if (wardId) patientMatcher.setWardId(wardId)
          req.setPatientMatcher(patientMatcher)
          break
      }

      const res = await APIServices.propertyValues.getAttachedPropertyValues(req, getAuthenticatedGrpcMetadata())

      const results: DisplayableAttachedProperty[] = res.getValuesList().map(result => {
        const selectValue = result.getSelectValue()
        const valueCase = result.getValueCase()
        const isValueNotSet = valueCase === GetAttachedPropertyValuesResponse.Value.ValueCase.VALUE_NOT_SET

        return {
          propertyId: result.getPropertyId(),
          subjectId,
          subjectType,
          name: result.getName(),
          description: result.getDescription(),
          fieldType: GRPCConverter.fieldTypeMapperFromGRPC(result.getFieldType()),
          value: isValueNotSet ? emptyPropertyValue : {
            textValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.TEXT_VALUE ? undefined : result.getTextValue(),
            numberValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.NUMBER_VALUE ? undefined : result.getNumberValue(),
            boolValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.BOOL_VALUE ? undefined : result.getBoolValue(),
            dateValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.DATE_VALUE ? undefined : result.getDateValue()!.getDate()!.toDate(),
            dateTimeValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.DATE_TIME_VALUE ? undefined : result.getDateTimeValue()!.toDate(),
            singleSelectValue: valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.SELECT_VALUE ? undefined : {
              id: selectValue!.getId(),
              name: selectValue!.getName(),
              description: selectValue!.getDescription(),
            },
            multiSelectValue: (valueCase !== GetAttachedPropertyValuesResponse.Value.ValueCase.MULTI_SELECT_VALUE ? [] : result.getMultiSelectValue()!.getSelectValuesList()).map(value => ({
              id: value.getId(),
              name: value.getName(),
              description: value.getDescription()
            })) ?? [],
          }
        }
      })
      return results
    },
  })
}

type AttachedPropertyMutationUpdate<T extends AttachedProperty> = Update<T> & {
  fieldType: FieldType
}

/**
 * Mutation to insert or update a properties value for a properties attached to a subject
 */
export const useAttachedPropertyMutation = <T extends AttachedProperty>(callback: (property: T) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (update: AttachedPropertyMutationUpdate<T>) => {
      const req = new AttachPropertyValueRequest()
      const { update: property, previous, fieldType } = update

      req.setPropertyId(property.propertyId)
        .setSubjectId(property.subjectId)

      switch (fieldType) {
        case 'text':
          if (property.value.textValue !== undefined) {
            req.setTextValue(property.value.textValue)
          }
          break
        case 'number':
          if (property.value.numberValue !== undefined) {
            req.setNumberValue(property.value.numberValue)
          }
          break
        case 'checkbox':
          if (property.value.boolValue !== undefined) {
            req.setBoolValue(property.value.boolValue)
          }
          break
        case 'date':
          if (property.value.dateValue !== undefined) {
            const protoDate = new ProtoDate().setDate(GRPCConverter.dateToTimestamp(property.value.dateValue))
            req.setDateValue(protoDate)
          }
          break
        case 'dateTime':
          if (property.value.dateTimeValue !== undefined) {
            req.setDateTimeValue(GRPCConverter.dateToTimestamp(property.value.dateTimeValue))
          }
          break
        case 'singleSelect':
          if (property.value.singleSelectValue !== undefined) {
            req.setSelectValue(property.value.singleSelectValue.id)
          }
          break
        case 'multiSelect':
          if (property.value.multiSelectValue !== undefined) {
            const previousOptions = previous?.value.multiSelectValue?.map(value => value.id) ?? []
            const newOptions = property.value.multiSelectValue.map(value => value.id)
            const addIds = ArrayUtil.difference(newOptions, previousOptions)
            const deleteIds = ArrayUtil.difference(previousOptions, newOptions)

            req.setMultiSelectValue(new AttachPropertyValueRequest.MultiSelectValue()
              .setSelectValuesList(addIds)
              .setRemoveSelectValuesList(deleteIds)
            )
          }
          break
        default:
          console.warn('invalid type for property value mutation')
      }

      console.log(property.value, fieldType)
      await APIServices.propertyValues.attachPropertyValue(req, getAuthenticatedGrpcMetadata())

      const newProperty: T = {
        ...property,
      }

      callback(newProperty)
      return newProperty
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QueryKeys.properties, QueryKeys.attachedProperties, data.subjectId]).then()
    },
  })
}
