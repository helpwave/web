import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import type { IdentifiedProperty, Property, PropertyWithValue, SubjectType } from '@/components/layout/property/property'

export const propertyQueryKey = 'property'
export const propertyWithValueQueryKey = 'property'

// TODO delete this
export let propertiesExample: IdentifiedProperty[] = [
  {
    id: '1',
    basicInfo: {
      propertyName: 'Birth Date',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'date',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '2',
    basicInfo: {
      propertyName: 'Weight',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'number',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'softRequired',
      isAlwaysVisible: true
    }
  },
  {
    id: '3',
    basicInfo: {
      propertyName: 'Gender',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'singleSelect',
      entryList: ['male', 'female', 'divers', 'other'],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'softRequired',
      isAlwaysVisible: true
    }
  },
  {
    id: '4',
    basicInfo: {
      propertyName: 'Round Notes',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'text',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '5',
    basicInfo: {
      propertyName: 'Admission Date',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'date',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '6',
    basicInfo: {
      propertyName: 'Diagnosis',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'multiSelect',
      entryList: ['Diabetes', 'Depression', 'Allergy', 'Cancer', 'Obesity'],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '7',
    basicInfo: {
      propertyName: 'Additonal Care',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'checkbox',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '8',
    basicInfo: {
      propertyName: 'Age',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'number',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '9',
    basicInfo: {
      propertyName: 'Location',
      subjectType: 'ward',
      description: '',
    },
    field: {
      fieldType: 'text',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '10',
    basicInfo: {
      propertyName: 'Contract',
      subjectType: 'ward',
      description: '',
    },
    field: {
      fieldType: 'text',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '11',
    basicInfo: {
      propertyName: 'Contact',
      subjectType: 'organization',
      description: '',
    },
    field: {
      fieldType: 'text',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'softRequired',
      isAlwaysVisible: true
    }
  },
  {
    id: '12',
    basicInfo: {
      propertyName: 'Last Cleaned',
      subjectType: 'bed',
      description: '',
    },
    field: {
      fieldType: 'date',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '13',
    basicInfo: {
      propertyName: 'Intensive Care',
      subjectType: 'room',
      description: '',
    },
    field: {
      fieldType: 'checkbox',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
]

// TODO delete this
export let propertiesWithValuesExample: PropertyWithValue[] = [
  {
    id: '1',
    propertyId: '1',
    value: {},
    basicInfo: {
      propertyName: 'Birth Date',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'date',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '2',
    propertyId: '2',
    value: { numberInput: 75 },
    basicInfo: {
      propertyName: 'Weight',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'number',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'softRequired',
      isAlwaysVisible: true
    }
  },
  {
    id: '3',
    propertyId: '3',
    value: {},
    basicInfo: {
      propertyName: 'Gender',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'singleSelect',
      entryList: ['male', 'female', 'divers', 'other'],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'softRequired',
      isAlwaysVisible: true
    }
  },
  {
    id: '4',
    propertyId: '4',
    value: {},
    basicInfo: {
      propertyName: 'Round Notes',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'text',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '5',
    propertyId: '5',
    value: {},
    basicInfo: {
      propertyName: 'Admission Date',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'date',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '6',
    propertyId: '6',
    value: { multiSelect: ['Diabetes', 'Cancer', 'Obesity'] },
    basicInfo: {
      propertyName: 'Diagnosis',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'multiSelect',
      entryList: ['Diabetes', 'Depression', 'Allergy', 'Cancer', 'Obesity'],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
  {
    id: '7',
    propertyId: '7',
    value: {},
    basicInfo: {
      propertyName: 'Additonal Care',
      subjectType: 'patient',
      description: '',
    },
    field: {
      fieldType: 'checkbox',
      entryList: [],
      isAllowingCustomValues: true,
    },
    rules: {
      importance: 'optional',
      isAlwaysVisible: true
    }
  },
]

export const usePropertyListQuery = (subjectType?: SubjectType) => {
  return useQuery({
    queryKey: [propertyQueryKey, subjectType ?? 'all'],
    queryFn: async () => {
      // TODO backend request here
      if (subjectType === undefined) {
        return propertiesExample
      }
      return propertiesExample.filter(value => value.basicInfo.subjectType === subjectType)
    },
  })
}

export const usePropertyQuery = (id?: string, subjectType?: SubjectType) => {
  return useQuery({
    queryKey: [propertyQueryKey, id, subjectType],
    enabled: !!id && !!subjectType,
    queryFn: async () => {
      // TODO backend request here
      return propertiesExample.find(value => value.id === id && value.basicInfo.subjectType === subjectType)
    },
  })
}

export const usePropertyCreateMutation = (callback: (property: IdentifiedProperty) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: Property) => {
      // TODO backend request here
      const newProperty = { ...property, id: Math.random().toString() }
      propertiesExample.push(newProperty)
      callback(newProperty)
      return newProperty.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
    }
  })
}

export const usePropertyUpdateMutation = (callback: (property: IdentifiedProperty) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: IdentifiedProperty) => {
      // TODO backend request here
      propertiesExample = propertiesExample.map(value => value.id === property.id ? { ...property } : value)
      propertiesWithValuesExample = propertiesWithValuesExample.map(value => value.propertyId === property.id ? {
        // Overwrite property props
        ...value,
        ...property,
        id: value.id
      } : value)
      callback(property)
      return property
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
      queryClient.invalidateQueries([propertyWithValueQueryKey]).then()
    }
  })
}

export const usePropertyArchiveMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: IdentifiedProperty) => {
      // TODO backend request here
      propertiesExample = propertiesExample.filter(value => value.id !== property.id)
      propertiesWithValuesExample = propertiesWithValuesExample.filter(value => value.propertyId !== property.id)
      callback()
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
      queryClient.invalidateQueries([propertyWithValueQueryKey]).then()
    }
  })
}

export const usePropertyWithValueListQuery = (propertyId: string | undefined, subjectType: SubjectType) => {
  return useQuery({
    queryKey: [propertyWithValueQueryKey, propertyId, subjectType],
    enabled: !!propertyId,
    queryFn: async () => {
      // TODO backend request here
      return propertiesWithValuesExample.filter(value => value.basicInfo.subjectType === subjectType)
    },
  })
}

export const usePropertyWithValueCreateMutation = (callback: (property: PropertyWithValue) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: PropertyWithValue) => {
      // TODO backend request here
      const newProperty: PropertyWithValue = { ...property, id: Math.random().toString() }
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
