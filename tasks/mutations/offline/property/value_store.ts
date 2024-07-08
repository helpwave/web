import type { Property } from '@/mutations/property/common'
import { emptyProperty } from '@/mutations/property/common'

export const propertiesExample: Property[] = [
  {
    ...emptyProperty,
    id: '1',
    name: 'Birth Date',
    fieldType: 'date',
  },
  {
    ...emptyProperty,
    id: '2',
    name: 'Weight',
    fieldType: 'number',
  },
  {
    ...emptyProperty,
    id: '3',
      name: 'Gender',
      fieldType: 'singleSelect',
      selectData: {['male', 'female', 'divers', 'other']},
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

export const propertiesWithValuesExample: PropertyWithValue[] = [
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
