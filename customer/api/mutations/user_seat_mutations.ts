import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/api/mutations/query_keys'
import type { UserSeat } from '@/api/dataclasses/user_seat'

// TODO delete later
const userSeatData: UserSeat[] = [
  {
    customerUUID: 'customer',
    email: 'test1@helpwave.de',
    firstName: 'Max',
    lastName: 'Mustermann',
    role: 'admin',
    enabled: true
  },
  {
    customerUUID: 'customer',
    email: 'test2@helpwave.de',
    firstName: 'Mary',
    lastName: 'Jane',
    role: 'admin',
    enabled: true
  },
  {
    customerUUID: 'customer',
    email: 'test3@helpwave.de',
    firstName: 'Maxine',
    lastName: 'Mustermann',
    role: 'user',
    enabled: true
  },
  {
    customerUUID: 'customer',
    email: 'test4@helpwave.de',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    enabled: false
  },
  {
    customerUUID: 'customer',
    email: 'test5@helpwave.de',
    firstName: 'Peter',
    lastName: 'Parker',
    role: 'user',
    enabled: false
  },
]

export const useUserSeatsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.userSeat, 'all'],
    queryFn: async () => {
      // TODO do request here with auth data
      return userSeatData
    },
  })
}

export const useUserSeatUpdateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userSeat: UserSeat) => {
      // TODO do request here

      const index = userSeatData.findIndex(e => e.customerUUID === userSeat.customerUUID && e.email === userSeat.email)
      if (index === -1) {
        throw 'User Seat not found'
      }
      userSeatData[index] = userSeat

      return userSeat
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.customer]).catch(reason => console.error(reason))
    }
  })
}
