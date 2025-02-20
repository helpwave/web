import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import {
  AttachPropertyValueRequest,
  AttachPropertyValueResponse,
  GetAttachedPropertyValuesRequest,
  GetAttachedPropertyValuesResponse, MultiSelectValue, SelectValueOption
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import { Date as ProtoDate } from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import type { Metadata } from 'grpc-web'
import { ArrayUtil } from '@helpwave/common/util/array'
import { builder } from '@helpwave/common/util/builder'
import { OfflineValueStore } from '../value_store'
import { GRPCConverter } from '../../util/util'
import type { AttachedProperty, PropertyValue } from '../../types/properties/attached_property'
import { emptyPropertyValue } from '../../types/properties/attached_property'
import type { SelectOption } from '../../types/properties/property'

export class PropertyValueOfflineServicePromiseClient extends PropertyValueServicePromiseClient {
  async getAttachedPropertyValues(request: GetAttachedPropertyValuesRequest, _?: Metadata): Promise<GetAttachedPropertyValuesResponse> {
    let subjectId: string | undefined
    let subjectType: string | undefined
    switch (request.getMatcherCase()) {
      case GetAttachedPropertyValuesRequest.MatcherCase.TASK_MATCHER:
        subjectId = request.getTaskMatcher()!.getTaskId()
        subjectType = 'task'
        break
      case GetAttachedPropertyValuesRequest.MatcherCase.PATIENT_MATCHER:
        subjectId = request.getPatientMatcher()!.getPatientId()
        subjectType = 'patient'
        break
      default:
        throw Error('No matcher provided')
    }

    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    const values = valueStore.attachedProperties.filter(
      value => value.subjectId === subjectId
        && valueStore.properties.find(property => property.id === value.propertyId)?.subjectType === subjectType
    )

    const valueList: GetAttachedPropertyValuesResponse.Value[] = values.map(value => {
      const attachedProperty = new GetAttachedPropertyValuesResponse.Value()
      const property = valueStore.properties.find(value1 => value1.id === value.propertyId)
      if (!property) {
        throw Error(`getAttachedPropertyValues: Could not find property for propertyId: ${value.propertyId}. Local storage seems corrupted.`)
      }
      const propertyValue = value.value

      attachedProperty.setPropertyId(value.propertyId)
      attachedProperty.setName(property.name)
      if (property.description) {
        attachedProperty.setDescription(property.description)
      }
      attachedProperty.setIsArchived(property.isArchived)
      attachedProperty.setFieldType(GRPCConverter.fieldTypeMapperToGRPC(property.fieldType))
      switch (property.fieldType) {
        case 'text':
          if (propertyValue.textValue !== undefined) {
            attachedProperty.setTextValue(propertyValue.textValue)
          }
          break
        case 'number':
          if (propertyValue.numberValue !== undefined) {
            attachedProperty.setNumberValue(propertyValue.numberValue)
          }
          break
        case 'checkbox':
          if (propertyValue.boolValue !== undefined) {
            attachedProperty.setBoolValue(propertyValue.boolValue)
          }
          break
        case 'date':
          if (propertyValue.dateValue !== undefined) {
            const protoDate = new ProtoDate().setDate(GRPCConverter.dateToTimestamp(propertyValue.dateValue))
            attachedProperty.setDateValue(protoDate)
          }
          break
        case 'dateTime':
          if (propertyValue.dateTimeValue !== undefined) {
            attachedProperty.setDateTimeValue(GRPCConverter.dateToTimestamp(propertyValue.dateTimeValue))
          }
          break
        case 'singleSelect':
          if (propertyValue.singleSelectValue !== undefined) {
            attachedProperty.setSelectValue(
              builder(new SelectValueOption(), value => {
                value.setId(propertyValue.singleSelectValue!.id)
                value.setName(propertyValue.singleSelectValue!.name)
                if (propertyValue.singleSelectValue!.description !== undefined) {
                  value.setDescription(propertyValue.singleSelectValue!.description)
                }
              })
            )
          }
          break
        case 'multiSelect':
          if (propertyValue.multiSelectValue !== undefined) {
            attachedProperty.setMultiSelectValue(new MultiSelectValue()
              .setSelectValuesList(
                propertyValue.multiSelectValue.map(selectValue => builder(new SelectValueOption(), value => {
                  value.setId(selectValue.id)
                  value.setName(selectValue.name)
                  if (selectValue.description !== undefined) {
                    value.setDescription(selectValue.description)
                  }
                }))
              ))
          }
          break
      }

      return attachedProperty
    })

    return new GetAttachedPropertyValuesResponse().setValuesList(valueList)
  }

  async attachPropertyValue(request: AttachPropertyValueRequest, _?: Metadata): Promise<AttachPropertyValueResponse> {
    const propertyId = request.getPropertyId()
    const subjectId = request.getSubjectId()

    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    const property = valueStore.properties.find(value1 => value1.id === propertyId)
    if (!property) {
      throw Error(`attachPropertyValue: Could not find property for propertyId: ${propertyId}`)
    }
    const valueNotSet = request.getValueCase() === AttachPropertyValueRequest.ValueCase.VALUE_NOT_SET

    const singleSelectBuilder = (selectId: string): SelectOption => {
      const option = property.selectData!.options.find(value => value.id === selectId)
      if (!option) {
        throw Error(`Could not find selectOption with id ${selectId} on property with id ${propertyId}`)
      }
      return option
    }

    const multiSelectUpdateBuilder = (addIds: string[], removeIds: string[]): SelectOption[] => {
      const attachedProperty = valueStore.attachedProperties.find(value => value.propertyId === propertyId && value.subjectId === subjectId)
      if (!attachedProperty && removeIds.length > 0) {
        throw Error('MultiSelectValue.remove_select_ids cannot hold a value if you are creating a property')
      }
      const previousSelects = (attachedProperty?.value.multiSelectValue ?? []).map(value => value.id)
      const filtered = ArrayUtil.difference(previousSelects, removeIds)
      const withAdded = [...filtered, ...addIds]
      const unique = ArrayUtil.unique(withAdded)
      if (filtered.length + addIds.length !== unique.length) {
        console.warn('MultiSelectValue.select_values attempted to add a SelectOption that already is contained in the list')
      }
      return unique.map(value => singleSelectBuilder(value))
    }

    const valueCase = request.getValueCase()
    if ((valueCase === AttachPropertyValueRequest.ValueCase.SELECT_VALUE || valueCase === AttachPropertyValueRequest.ValueCase.MULTI_SELECT_VALUE) && property.fieldType !== 'singleSelect' && property.fieldType !== 'multiSelect') {
      throw Error('Attempting to update a select value on a non select property')
    }
    const propertyValue: PropertyValue = valueNotSet ? emptyPropertyValue : {
      boolValue: valueCase !== AttachPropertyValueRequest.ValueCase.BOOL_VALUE ? undefined : request.getBoolValue(),
      textValue: valueCase !== AttachPropertyValueRequest.ValueCase.TEXT_VALUE ? undefined : request.getTextValue(),
      numberValue: valueCase !== AttachPropertyValueRequest.ValueCase.NUMBER_VALUE ? undefined : request.getNumberValue(),
      dateValue: valueCase !== AttachPropertyValueRequest.ValueCase.DATE_VALUE ? undefined : request.getDateValue()!.getDate()!.toDate(),
      dateTimeValue: valueCase !== AttachPropertyValueRequest.ValueCase.DATE_TIME_VALUE ? undefined : request.getDateTimeValue()!.toDate(),
      singleSelectValue: valueCase !== AttachPropertyValueRequest.ValueCase.SELECT_VALUE ? undefined : singleSelectBuilder(request.getSelectValue()),
      multiSelectValue: valueCase !== AttachPropertyValueRequest.ValueCase.MULTI_SELECT_VALUE ? [] : multiSelectUpdateBuilder(
        request.getMultiSelectValue()!.getSelectValuesList(),
        request.getMultiSelectValue()!.getRemoveSelectValuesList()
      ),
    }

    const attachedProperty: AttachedProperty = {
      propertyId,
      subjectId,
      value: propertyValue
    }

    const index = valueStore.attachedProperties.findIndex(value => value.subjectId === subjectId && value.propertyId === attachedProperty.propertyId)

    if (index !== -1) {
      valueStore.attachedProperties[index] = attachedProperty
    } else {
      valueStore.attachedProperties.push(attachedProperty)
    }

    return new AttachPropertyValueResponse().setPropertyValueId(property.subjectType + subjectId)
  }
}
