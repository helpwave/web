import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Customer } from '@/api/dataclasses/customer'

// TODO delete later
let customerData: Customer = {
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

export const useCustomerMyselfQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.customer],
    queryFn: async () => {
      // TODO do request here with auth data
      return customerData
    },
  })
}

export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      // TODO do request here

      if (customer.uuid === customerData.uuid) {
        customerData = customer
      }

      return customer
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}
