import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import {
  CreatePropertyRequest,
  GetPropertiesBySubjectTypeRequest,
  GetPropertyRequest,
  UpdatePropertyRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import { FieldType } from '@helpwave/proto-ts/services/property_svc/v1/types_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { QueryKeys } from '../query_keys'
import type { Property, SelectData, SelectOption, SubjectType } from '../../types/properties/property'
import { GRPCConverter } from '../../util/util'

export const usePropertyListQuery = (subjectType?: SubjectType) => {
  return useQuery({
    queryKey: [QueryKeys.properties, subjectType ?? 'all'],
    queryFn: async (): Promise<Property[]> => {
      const req = new GetPropertiesBySubjectTypeRequest()
      if (subjectType) {
        req.setSubjectType(GRPCConverter.subjectTypeMapperToGRPC(subjectType))
      }
      const result = await APIServices.property.getPropertiesBySubjectType(req, getAuthenticatedGrpcMetadata())
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
          alwaysIncludeForViewSource: undefined,
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
  })
}

export const usePropertyQuery = (id?: string) => {
  return useQuery({
    queryKey: [QueryKeys.properties, id],
    enabled: !!id,
    queryFn: async (): Promise<Property> => {
      if (!id) {
        throw Error('usePropertyQuery no id in mutate')
      }
      const req = new GetPropertyRequest()
      req.setId(id)

      const result = await APIServices.property.getProperty(req, getAuthenticatedGrpcMetadata())

      const fieldType = GRPCConverter.fieldTypeMapperFromGRPC(result.getFieldType())
      let selectData: SelectData | undefined
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
        alwaysIncludeForViewSource: undefined,
        selectData,
      }
    },
  })
}

export const usePropertyCreateMutation = (callback: (property: Property) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: Property) => {
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

      const newValue = {
        ...property,
        id
      }
      callback(newValue)
      return newValue
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.properties]).then()
    }
  })
}

export const usePropertyUpdateMutation = (callback: (property: Property) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: Property) => {
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
        /* This is done in a separate function
          selectDataVal.set(properties.selectData.options.map(option => {
            const optionVal = new UpdatePropertyRequest.SelectData.SelectOption()
            optionVal.setName(option.name)
            if (option.description) {
              optionVal.setDescription(option.description)
            }
            return optionVal
          }))
          */
        req.setSelectData(selectDataVal)
      }

      const result = await APIServices.property.updateProperty(req, getAuthenticatedGrpcMetadata())
      if (!result.toObject()) {
        throw Error('usePropertyUpdateMutation: error in result')
      }
      callback(property)
      return property
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.properties]).then()
    }
  })
}

type ChangeSelectOptions = {
  propertyId: string,
  add: SelectOption[],
  update: SelectOption[],
  remove: string[]
}
export const usePropertyChangeSelectOptionMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (changeSelectOptions: ChangeSelectOptions) => {
      const req = new UpdatePropertyRequest()
      req.setId(changeSelectOptions.propertyId)
      const selectDataVal = new UpdatePropertyRequest.SelectData()
      const createList = changeSelectOptions.update.map(option => {
        const optionVal = new UpdatePropertyRequest.SelectData.SelectOption()
        optionVal.setId('')
        optionVal.setName(option.name)
        if (option.description) {
          optionVal.setDescription(option.description)
        }
        optionVal.setIsCustom(option.isCustom)
        return optionVal
      })
      const updateList = changeSelectOptions.update.map(option => {
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
      req.setSelectData(selectDataVal)

      const result = await APIServices.property.updateProperty(req, getAuthenticatedGrpcMetadata())
      if (!result.toObject()) {
        throw Error('usePropertyUpdateOrAddSelectDataMutation: error in result')
      }
      callback()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.properties]).then()
    }
  })
}
