import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import {
  CreatePropertyRequest,
  GetPropertiesBySubjectTypeRequest,
  GetPropertyRequest, UpdatePropertyRequest
} from '@helpwave/proto-ts/services/property_svc/v1/property_svc_pb'
import type {
  Property, SelectOption,
  SubjectType
} from '@/components/layout/property/property'
import { propertyService } from '@/utils/grpc'
import {
  fieldTypeMapperFromGRPC, fieldTypeMapperToGRPC,
  subjectTypeMapperFromGRPC,
  subjectTypeMapperToGRPC
} from '@/components/layout/property/property'
import { propertyQueryKey } from '@/mutations/property/common'

export const usePropertyListQuery = (subjectType?: SubjectType) => {
  return useQuery({
    queryKey: [propertyQueryKey, subjectType ?? 'all'],
    queryFn: async (): Promise<Property[]> => {
      const req = new GetPropertiesBySubjectTypeRequest()
      if (subjectType) {
        req.setSubjectType(subjectTypeMapperToGRPC(subjectType))
      }
      const result = await propertyService.getPropertiesBySubjectType(req)
      return result.getPropertiesList().map(property => {
        const selectData = property.getSelectData()
        if (!selectData) {
          throw Error('usePropertyListQuery could not find selectData')
        }
        return {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          subjectType: subjectTypeMapperFromGRPC(property.getSubjectType()),
          fieldType: fieldTypeMapperFromGRPC(property.getFieldType()),
          isArchived: property.getIsArchived(),
          setId: property.getSetId(),
          always_include_for_view_source: undefined,
          selectData: {
            isAllowingFreetext: selectData.getAllowFreetext(),
            options: selectData.getOptionsList().map(option => ({
              id: option.getId(),
              name: option.getName(),
              description: option.getDescription(),
              isCustom: option.getIsCustom()
            }))
          }
        }
      })
    },
  })
}

export const usePropertyQuery = (id?: string, subjectType?: SubjectType) => {
  return useQuery({
    queryKey: [propertyQueryKey, id, subjectType],
    enabled: !!id && !!subjectType,
    queryFn: async (): Promise<Property> => {
      if (!id) {
        throw Error('usePropertyQuery no id in mutate')
      }
      const req = new GetPropertyRequest()
      req.setId(id)

      const result = await propertyService.getProperty(req)

      const selectData = result.getSelectData()
      if (!selectData) {
        throw Error('usePropertyQuery could not find selectData')
      }
      return {
        id: result.getId(),
        name: result.getName(),
        description: result.getDescription(),
        subjectType: subjectTypeMapperFromGRPC(result.getSubjectType()),
        fieldType: fieldTypeMapperFromGRPC(result.getFieldType()),
        isArchived: result.getIsArchived(),
        setId: result.getSetId(),
        always_include_for_view_source: undefined,
        selectData: {
          isAllowingFreetext: selectData.getAllowFreetext(),
          options: selectData.getOptionsList().map(option => ({
            id: option.getId(),
            name: option.getName(),
            description: option.getDescription(),
            isCustom: option.getIsCustom()
          }))
        }
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
      req.setSubjectType(subjectTypeMapperToGRPC(property.subjectType))
      req.setFieldType(fieldTypeMapperToGRPC(property.fieldType))
      if (property.setId) {
        req.setSetId(property.setId)
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

      const result = await propertyService.createProperty(req)

      const id = result.getPropertyId()

      const newValue = { ...property, id }
      callback(newValue)
      return newValue
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
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
      req.setSubjectType(subjectTypeMapperToGRPC(property.subjectType))
      if (property.description) {
        req.setDescription(property.description)
      }
      if (property.setId) {
        req.setSetId(property.setId)
      }
      const selectDataVal = new UpdatePropertyRequest.SelectData()
      selectDataVal.setAllowFreetext(property.selectData.isAllowingFreetext)
      /* This is done in a separate function
      selectDataVal.set(property.selectData.options.map(option => {
        const optionVal = new UpdatePropertyRequest.SelectData.SelectOption()
        optionVal.setName(option.name)
        if (option.description) {
          optionVal.setDescription(option.description)
        }
        return optionVal
      }))
      */
      req.setSelectData(selectDataVal)

      const result = await propertyService.updateProperty(req)
      if (!result.toObject()) {
        throw Error('usePropertyUpdateMutation: error in result')
      }
      callback(property)
      return property
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
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

      const result = await propertyService.updateProperty(req)
      if (!result.toObject()) {
        throw Error('usePropertyUpdateOrAddSelectDataMutation: error in result')
      }
      callback()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
    }
  })
}
