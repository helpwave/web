import type { Property, PropertySelectData, PropertySubjectType } from '../../types/properties/property'
import {
  CreatePropertyRequest,
  GetPropertiesRequest,
  GetPropertyRequest, UpdatePropertyRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import { GRPCConverter } from '../../util/util'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { FieldType } from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import type { PropertyUpdateType } from '../../mutations/properties/property_mutations'

export const PropertyService = {
  get: async (id: string): Promise<Property> => {
    const req = new GetPropertyRequest()
    req.setId(id)

    const result = await APIServices.property.getProperty(req, getAuthenticatedGrpcMetadata())

    const fieldType = GRPCConverter.fieldTypeMapperFromGRPC(result.getFieldType())
    let selectData: PropertySelectData | undefined
    if (fieldType === 'singleSelect' || fieldType === 'multiSelect') {
      const responseSelectData = result.getSelectData()
      if (!responseSelectData) {
        throw Error('usePropertyQuery could not find selectData')
      }
      selectData = {
        isAllowingFreetext: responseSelectData.getAllowFreetext(),
        options: responseSelectData.getOptionsList().map(option => ({
          id: option.getId(),
          name: option.getName(),
          description: option.getDescription(),
          isCustom: option.getIsCustom()
        }))
      }
    }
    return {
      id: result.getId(),
      name: result.getName(),
      description: result.getDescription(),
      subjectType: GRPCConverter.subjectTypeMapperFromGRPC(result.getSubjectType()),
      fieldType,
      isArchived: result.getIsArchived(),
      setId: result.getSetId(),
      alwaysIncludeForViewSource: result.getAlwaysIncludeForViewSource(),
      selectData,
    }
  },
  getList: async (subjectType?: PropertySubjectType): Promise<Property[]> => {
    const req = new GetPropertiesRequest()
    if (subjectType) {
      req.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(subjectType))
    }
    const result = await APIServices.property.getProperties(req, getAuthenticatedGrpcMetadata())
    return result.getPropertiesList().filter(value => value.getFieldType() !== FieldType.FIELD_TYPE_UNSPECIFIED).map(property => {
      const fieldType = GRPCConverter.fieldTypeMapperFromGRPC(property.getFieldType())
      const selectData = property.getSelectData()
      const mustHaveSelectData = fieldType === 'singleSelect' || fieldType === 'multiSelect'
      if (!selectData && mustHaveSelectData) {
        throw Error('usePropertyListQuery could not find selectData')
      }
      return {
        id: property.getId(),
        name: property.getName(),
        description: property.getDescription(),
        subjectType: GRPCConverter.subjectTypeMapperFromGRPC(property.getSubjectType()),
        fieldType,
        isArchived: property.getIsArchived(),
        setId: property.getSetId(),
        selectData: mustHaveSelectData ? {
          isAllowingFreetext: selectData!.getAllowFreetext(),
          options: selectData!.getOptionsList().map(option => ({
            id: option.getId(),
            name: option.getName(),
            description: option.getDescription(),
            isCustom: option.getIsCustom()
          }))
        } : undefined
      }
    })
  },
  create: async (property: Property): Promise<Property> => {
    const req = new CreatePropertyRequest()
    req.setName(property.name)
    if (property.description) {
      req.setDescription(property.description)
    }
    req.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(property.subjectType))
    req.setFieldType(GRPCConverter.fieldTypeMapperToGRPC(property.fieldType))
    if (property.setId) {
      req.setSetId(property.setId)
    }
    if (property.fieldType === 'singleSelect' || property.fieldType === 'multiSelect') {
      if (!property.selectData) {
        throw Error('Select FieldType, but select data not set')
      }
      const selectDataVal = new CreatePropertyRequest.SelectData()
      selectDataVal.setAllowFreetext(property.selectData.isAllowingFreetext)
      selectDataVal.setOptionsList(property.selectData.options.map(option => {
        const optionVal = new CreatePropertyRequest.SelectData.SelectOption()
        optionVal.setName(option.name)
        if (option.description) {
          optionVal.setDescription(option.description)
        }
        return optionVal
      }))
      req.setSelectData(selectDataVal)
    }

    const result = await APIServices.property.createProperty(req, getAuthenticatedGrpcMetadata())

    const id = result.getPropertyId()

    return {
      ...property,
      id
    }
  },
  update: async ({ property, selectUpdate }: PropertyUpdateType): Promise<boolean> => {
    const req = new UpdatePropertyRequest()
    req.setId(property.id)
    req.setName(property.name)
    req.setIsArchived(property.isArchived)
    req.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(property.subjectType))
    if (property.description) {
      req.setDescription(property.description)
    }
    if (property.setId) {
      req.setSetId(property.setId)
    }
    if (property.fieldType === 'singleSelect' || property.fieldType === 'multiSelect') {
      if (!property.selectData) {
        throw Error('Select FieldType, but select data not set')
      }
      const selectDataVal = new UpdatePropertyRequest.SelectData()
      selectDataVal.setAllowFreetext(property.selectData.isAllowingFreetext)
      if (selectUpdate) {
        const createList = selectUpdate.add.map(option => {
          const optionVal = new UpdatePropertyRequest.SelectData.SelectOption()
          optionVal.setId('')
          optionVal.setName(option.name)
          if (option.description) {
            optionVal.setDescription(option.description)
          }
          optionVal.setIsCustom(option.isCustom)
          return optionVal
        })
        const updateList = selectUpdate.update.map(option => {
          const optionVal = new UpdatePropertyRequest.SelectData.SelectOption()
          optionVal.setId(option.id)
          optionVal.setName(option.name)
          if (option.description) {
            optionVal.setDescription(option.description)
          }
          optionVal.setIsCustom(option.isCustom)
          return optionVal
        })
        selectDataVal.setUpsertOptionsList([...updateList, ...createList])
        selectDataVal.setRemoveOptionsList(selectUpdate.remove)
      }
      req.setSelectData(selectDataVal)
    }

    const result = await APIServices.property.updateProperty(req, getAuthenticatedGrpcMetadata())
    return !!result
  }
}
