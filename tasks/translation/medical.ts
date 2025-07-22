import type { Translation, TranslationPlural } from '@helpwave/hightide'

export type MedicalTranslationType = {
  organization: TranslationPlural,
  ward: TranslationPlural,
  room: TranslationPlural,
  bed: TranslationPlural,
  patient: TranslationPlural,
}

export const medicalTranslation: Translation<MedicalTranslationType> = {
  en: {
    organization: {
      one: 'Organization',
      other: 'Organizations'
    },
    ward: {
      one: 'Ward',
      other: 'Wards'
    },
    room: {
      one: 'Room',
      other: 'Rooms'
    },
    bed: {
      one: 'Bed',
      other: 'Beds'
    },
    patient: {
      one: 'Patient',
      other: 'Patients'
    },
  },
  de: {
    organization: {
      one: 'Organisation',
      other: 'Organisationen'
    },
    ward: {
      one: 'Station',
      other: 'Stationen'
    },
    room: {
      one: 'Zimmer',
      other: 'Zimmer'
    },
    bed: {
      one: 'Bett',
      other: 'Betten'
    },
    patient: {
      one: 'Patient',
      other: 'Patienten'
    },
  }
}
