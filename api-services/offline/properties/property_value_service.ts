import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import {
  GetAttachedPropertyValuesResponse,
  AttachPropertyValueResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import {
  Date as ProtoDate
} from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import type {
  AttachPropertyValueRequest,
  GetAttachedPropertyValuesRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_pb'
import type { Metadata } from 'grpc-web'
import { OfflineValueStore } from '../value_store'
import { GRPCConverter } from '../../util/util'
import type { DisplayableAttachedProperty } from '../../types/properties/attached_property'

export class PropertyValueOfflineServicePromiseClient extends PropertyValueServicePromiseClient {
  async getAttachedPropertyValues(request: GetAttachedPropertyValuesRequest, _?: Metadata): Promise<GetAttachedPropertyValuesResponse> {
    const taskMatcher = request.getTaskMatcher()
    let subjectId: string | undefined
    let subjectType: string | undefined
    if (taskMatcher) {
      subjectId = taskMatcher.getTaskId()
      subjectType = 'task'
    }

    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    const values = valueStore.attachedProperties.filter(value => value.subjectId === subjectId && valueStore.properties.find(value1 => value1.id === value.propertyId)?.subjectType === subjectType)

    const valueList: GetAttachedPropertyValuesResponse.Value[] = values.map(value => {
      const attachedProperty = new GetAttachedPropertyValuesResponse.Value()
      const property = valueStore.properties.find(value1 => value1.id === value.propertyId)
      if (!property) {
        throw Error(`getAttachedPropertyValues: Could not find property for propertyId: ${value.propertyId}. Local storage seems corrupted.`)
      }
      attachedProperty.setPropertyId(value.propertyId)
      attachedProperty.setName(property.name)
      if (property.description) {
        attachedProperty.setDescription(property.description)
      }
      attachedProperty.setIsArchived(property.isArchived)
      attachedProperty.setFieldType(GRPCConverter.fieldTypeMapperToGRPC(property.fieldType))
      attachedProperty.setBoolValue(value.value.boolValue)
      attachedProperty.setNumberValue(value.value.numberValue)
      attachedProperty.setTextValue(value.value.textValue)
      const protoDate: ProtoDate = new ProtoDate().setDate(GRPCConverter.dateToTimestamp(value.value.dateValue))
      attachedProperty.setDateValue(protoDate)
      attachedProperty.setDateTimeValue(GRPCConverter.dateToTimestamp(value.value.dateTimeValue))
      attachedProperty.setSelectValue(value.value.singleSelectValue)
      return attachedProperty
    })

    const response = new GetAttachedPropertyValuesResponse()
    response.setValuesList(valueList)
    return response
  }

  async attachPropertyValue(request: AttachPropertyValueRequest, _?: Metadata): Promise<AttachPropertyValueResponse> {
    const propertyId = request.getPropertyId()
    const subjectId = request.getSubjectId()

    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    const property = valueStore.properties.find(value1 => value1.id === propertyId)
    if (!property) {
      throw Error(`attachPropertyValue: Could not find property for propertyId: ${propertyId}`)
    }

    const attachedProperty: DisplayableAttachedProperty = {
      propertyId,
      subjectId,
      subjectType: property.subjectType,
      name: property.name,
      description: property.description,
      fieldType: property.fieldType,
      value: {
        boolValue: request.getBoolValue(),
        textValue: request.getTextValue(),
        numberValue: request.getNumberValue(),
        dateValue: request.getDateValue()?.getDate() ? request.getDateValue()!.getDate()!.toDate() : new Date(),
        dateTimeValue: request.getDateTimeValue() ? request.getDateTimeValue()!.toDate() : new Date(),
        singleSelectValue: request.getSelectValue(),
        multiSelectValue: [] // TODO update later
      }
    }

    const index = valueStore.attachedProperties.findIndex(value => value.subjectId === subjectId && value.propertyId === attachedProperty.propertyId)

    if (index !== -1) {
      valueStore.attachedProperties[index] = attachedProperty
    } else {
      valueStore.attachedProperties.push(attachedProperty)
    }

    const result = new AttachPropertyValueResponse()
    result.setPropertyValueId(property.subjectType + subjectId)
    return result
  }
}
