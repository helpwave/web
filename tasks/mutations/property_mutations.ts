import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { noop } from '@helpwave/common/util/noop'
import type { PropertyWithValue } from '@/components/layout/property/property'

export const propertyQueryKey = 'property'

// TODO delete this
export let propertiesExample: PropertyWithValue[] = [
  {
    id: '1',
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
    value: { },
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

export const usePropertyListQuery = (propertyId?: string) => {
  return useQuery({
    queryKey: [propertyQueryKey, propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      // TODO backend request here
      return propertiesExample
    },
  })
}

export const usePropertyUpdateMutation = (callback: (property: PropertyWithValue) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (property: PropertyWithValue) => {
      // TODO backend request here
      propertiesExample = propertiesExample.map(value => value.id === property.id ? property : value)

      callback(property)
      return property
    },
    onSuccess: () => {
      queryClient.invalidateQueries([propertyQueryKey]).then()
    },
  })
}
