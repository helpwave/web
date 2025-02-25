// TODO delete later
import type { Customer } from '@/api/dataclasses/customer'

let customerData: Customer | undefined = undefined

/*
  {
  uuid: 'customer',
  name: 'Beispiel Krankenhaus',
  address: {
    city: 'Aachen',
    postalCode: '52062',
    street: 'Test Street',
    houseNumber: '42',
    houseNumberAdditional: '',
    country: 'Germany'
  },
  email: 'test@helpwave.de',
  creationDate: new Date(2025, 1, 1),
  phoneNumber: '+49 123 456789',
  websiteURL: 'https://helpwave.de',
}
*/

export const CustomerAPI = {
  getMyself: async () => {
    return customerData
  },
  create: async (customer: Customer) => {
    // TODO do request here
    if (!customerData) {
      customerData = { ...customer, uuid: Date().toString() }
    } else {
      throw 'Organization already exists'
    }
    return customerData
  },
  update: async (customer: Customer) => {
    // TODO do request here

    if (customer.uuid === customerData?.uuid) {
      customerData = customer
    }

    return customer
  },
  delete: async (_: string) => {
    // TODO do request here

    if (customerData) {
      customerData = undefined
    }else {
      throw 'You can only delete an already existing customer'
    }

    return true
  },
}
