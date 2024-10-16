import { PropertyServicePromiseClient } from '@helpwave/proto-ts/services/property_svc/v1/property_svc_grpc_web_pb'
import type {
  GetPropertiesRequest,
  GetPropertyRequest,
  CreatePropertyRequest, UpdatePropertyRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import {
  GetPropertiesResponse, GetPropertyResponse
  , CreatePropertyResponse
  , UpdatePropertyResponse
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import type { Metadata } from 'grpc-web'
import { OfflineValueStore } from '../value_store'
import type { Property, SelectData, SelectOption } from '../../types/properties/property'
import { GRPCConverter } from '../../util/util'

export class PropertyOfflineServicePromiseClient extends PropertyServicePromiseClient {
  async getPropertiesBySubjectType(request: GetPropertiesRequest, _?: Metadata): Promise<GetPropertiesResponse> {
    const subjectType = GRPCConverter.subjectTypeMapperFromGRPC(request.getSubjectType())
    const properties = OfflineValueStore.getInstance().properties.filter(value => value.subjectType === subjectType)
    const values = properties.map(value => {
      const res: GetPropertiesResponse.Property = new GetPropertiesResponse.Property()
      res.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(value.subjectType))
      res.setId(value.id)
      res.setName(value.name)
      if (value.description) {
        res.setDescription(value.description)
      }
      res.setFieldType(GRPCConverter.fieldTypeMapperToGRPC(value.fieldType))
      res.setIsArchived(value.isArchived)
      if (value.setId) {
        res.setSetId(value.setId)
      }
      if (value.fieldType === 'singleSelect' || value.fieldType === 'multiSelect') {
        if (!value.selectData) {
          throw Error('SelectData not set on a Select Property')
        }
        const selectData = new GetPropertiesResponse.Property.SelectData()
        selectData.setAllowFreetext(value.selectData.isAllowingFreetext)
        selectData.setOptionsList(value.selectData.options.map(value => {
          const option = new GetPropertiesResponse.Property.SelectData.SelectOption()
          option.setId(value.id)
          option.setName(value.name)
          if (value.description) {
            option.setDescription(value.description)
          }
          option.setIsCustom(value.isCustom)
          return option
        }))
        res.setSelectData(selectData)
      }

      return res
    })
    const result = new GetPropertiesResponse()
    result.setPropertiesList(values)
    return result
  }

  async getProperty(request: GetPropertyRequest, _?: Metadata): Promise<GetPropertyResponse> {
    const id = request.getId()
    const value = OfflineValueStore.getInstance().properties.find(value => value.id === id)
    if (!value) {
      throw Error(`GetProperty: Could not find property with propertyId: ${id}`)
    }
    const res = new GetPropertyResponse()
    res.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(value.subjectType))
    res.setId(value.id)
    res.setName(value.name)
    if (value.description) {
      res.setDescription(value.description)
    }
    res.setFieldType(GRPCConverter.fieldTypeMapperToGRPC(value.fieldType))
    res.setIsArchived(value.isArchived)
    if (value.setId) {
      res.setSetId(value.setId)
    }
    if (value.fieldType === 'singleSelect' || value.fieldType === 'multiSelect') {
      if (!value.selectData) {
        throw Error('SelectData not set on a Select Property')
      }
      const selectData = new GetPropertyResponse.SelectData()
      selectData.setAllowFreetext(value.selectData.isAllowingFreetext)
      selectData.setOptionsList(value.selectData.options.map(value => {
        const option = new GetPropertyResponse.SelectData.SelectOption()
        option.setId(value.id)
        option.setName(value.name)
        if (value.description) {
          option.setDescription(value.description)
        }
        option.setIsCustom(value.isCustom)
        return option
      }))
      res.setSelectData(selectData)
    }
    return res
  }

  async createProperty(request: CreatePropertyRequest, _?: Metadata): Promise<CreatePropertyResponse> {
    const selectData = request.getSelectData()

    const newProperty: Property = {
      id: Math.random().toString(),
      name: request.getName(),
      description: request.getDescription(),
      subjectType: GRPCConverter.subjectTypeMapperFromGRPC(request.getSubjectType()),
      fieldType: GRPCConverter.fieldTypeMapperFromGRPC(request.getFieldType()),
      isArchived: false,
      setId: request.getSetId(),
      alwaysIncludeForViewSource: true,
      selectData: {
        isAllowingFreetext: selectData?.getAllowFreetext() ?? false,
        options: selectData?.getOptionsList().map((value, index) => ({
          id: index.toString(),
          name: value.getName(),
          description: value.getDescription(),
          isCustom: false
        })) ?? []
      }
    }

    const res = new CreatePropertyResponse()
    res.setPropertyId(newProperty.id)
    return res
  }

  async updateProperty(request: UpdatePropertyRequest, _?: Metadata): Promise<UpdatePropertyResponse> {
    const property = OfflineValueStore.getInstance().properties.find(value => value.id === request.getId())

    if (!property) {
      throw Error(`UpdateProperty: Could not find a property with the id: ${request.getId()}`)
    }

    const newValue: Property = { ...property }
    if (request.hasName()) {
      newValue.name = request.getName()
    }
    if (request.hasDescription()) {
      newValue.description = request.getName()
    }
    if (request.hasIsArchived()) {
      newValue.isArchived = request.getIsArchived()
    }
    if (request.hasSetId()) {
      newValue.setId = request.getSetId()
    }
    if (request.hasSubjectType()) {
      newValue.subjectType = GRPCConverter.subjectTypeMapperFromGRPC(request.getSubjectType())
    }
    if ((property.fieldType === 'singleSelect' || property.fieldType === 'multiSelect') && request.hasSelectData()) {
      const selectUpdate = request.getSelectData()!
      const selectData: SelectData = { ...property.selectData! }
      if (selectUpdate.hasAllowFreetext()) {
        selectData.isAllowingFreetext = selectUpdate.getAllowFreetext()
      }
      const removeList: string[] = selectUpdate.getRemoveOptionsList()
      selectData.options = selectData.options.filter(value => !removeList.includes(value.id))
      for (const upsertItem of selectUpdate.getUpsertOptionsList()) {
        const index = selectData.options.findIndex(value => value.id === upsertItem.getId())
        if (upsertItem.getId() === '' || index === -1) {
          const option: SelectOption = {
            id: Math.random().toString(),
            name: upsertItem.getName(),
            isCustom: false
          }
          if (upsertItem.hasDescription()) {
            option.description = upsertItem.getDescription()
          }
          newValue.selectData!.options[index] = option
        }
      }
    }

    OfflineValueStore.getInstance().properties = OfflineValueStore.getInstance().properties.map(value => value.id === property.id ? newValue : value)

    return new UpdatePropertyResponse()
  }
}
