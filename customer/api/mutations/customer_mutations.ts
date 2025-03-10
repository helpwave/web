import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { Customer } from '@/api/dataclasses/customer'
import { CustomerAPI } from '@/api/services/customer'
import { useAuth } from '@/hooks/useAuth'
import { apiURL } from '@/config'



export const useCustomerMyselfQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.customer],
    queryFn: async () => {
      return await CustomerAPI.getMyself()
    },
  })
}

export const useCustomerCreateMutation = () => {
  const queryClient = useQueryClient()
  const { authHeader } = useAuth()
  return useMutation({
    mutationFn: async (customer: Customer) => {
     const data = await fetch(`${apiURL}/customer`, {
       method: 'PUT',
       mode: 'no-cors',
       headers: { ...authHeader },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        website_url: customer.websiteURL,
        address: customer.address.street,
        house_number: customer.address.houseNumber,
        care_of: customer.address.houseNumberAdditional,
        postal_code: customer.address.postalCode,
        city: customer.address.city,
        country: customer.address.country,
      })
     })
      const json = await data.json()
      console.log(json)
      // TODO parse json as customer
      return await CustomerAPI.create(customer)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (customer: Customer) => {
      return await CustomerAPI.update(customer)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}

export const useCustomerDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return await CustomerAPI.delete(id)
    },
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}
