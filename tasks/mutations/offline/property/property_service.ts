import { PropertyServicePromiseClient } from '@helpwave/proto-ts/services/property_svc/v1/property_svc_grpc_web_pb'
import type {
  GetPropertiesBySubjectTypeRequest,
  GetPropertyRequest,
  GetPropertiesBySubjectTypeResponse
  ,
  CreatePropertyRequest, CreatePropertyResponse, UpdatePropertyRequest, UpdatePropertyResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import {
  GetPropertyResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import type { Metadata } from 'grpc-web'

export class PropertyOfflineServicePromiseClient extends PropertyServicePromiseClient {
  getPropertiesBySubjectType(request: GetPropertiesBySubjectTypeRequest, metadata?: Metadata): Promise<GetPropertiesBySubjectTypeResponse> {
    const subjectType = request.getId()
    if (subjectType === undefined) {
      return propertiesExample
    }
    return propertiesExample.filter(value => value.basicInfo.subjectType === subjectType)
    return super.getProperty(request, metadata)
  }

  getProperty(request: GetPropertyRequest, _?: Metadata): Promise<GetPropertyResponse> {
    const id = request.getId()
    const entry = propertiesExample.find(value => value.id === id)
    if (!entry) {
      throw Error('PropertyOfflineServicePromiseClient.getProperty no entry found')
    }
    const response = new GetPropertyResponse()
    response.setId(id)
    response.setName(entry.name)
    response.setDescription(entry.description)
    response.setSubjectType()
    return response
  }

  createProperty(request: CreatePropertyRequest, metadata?: Metadata): Promise<CreatePropertyResponse> {
    // TODO backend request here
    const newProperty = {
      ...property,
      id: Math.random().toString()
    }
    propertiesExample.push(newProperty)
    callback(newProperty)
    return newProperty.id
  }

  updateProperty(request: UpdatePropertyRequest, metadata?: Metadata): Promise<UpdatePropertyResponse> {
    // TODO backend request here
    propertiesExample = propertiesExample.map(value => value.id === property.id ? { ...property } : value)
    propertiesWithValuesExample = propertiesWithValuesExample.map(oldValue => oldValue.propertyId === property.id ? {
      // Overwrite property props
      ...oldValue,
      // Delete entries not in the updated list
      value: {
        ...oldValue.value,
        multiSelect: oldValue.value.multiSelect ? oldValue.value.multiSelect.filter(value => property.field.entryList.find(value1 => value1 === value)) : undefined
      },
      ...property,
      id: oldValue.id
    } : oldValue)
    callback(property)
    return property
    return super.updateProperty(request, metadata)
  }
}
