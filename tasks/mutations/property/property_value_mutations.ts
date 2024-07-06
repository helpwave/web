import { noop } from '@helpwave/common/util/noop'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PropertyWithValue, SubjectType } from '@/components/layout/property/property'

export const usePropertyWithValueListQuery = (propertyId: string | undefined, subjectType: SubjectType) => {
  return useQuery({
    queryKey: [propertyWithValueQueryKey, propertyId, subjectType],
    enabled: !!propertyId,
    queryFn: async () => {
      // TODO backend request here

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
