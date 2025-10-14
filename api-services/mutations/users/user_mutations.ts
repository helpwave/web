import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import { UserService } from '../../service/users/UserService'

export const useUserQuery = (userId?: string) => {
  const enabled = !!userId
  return useQuery({
    queryKey: [QueryKeys.users, userId],
    enabled,
    queryFn: async () => {
      return await UserService.get(userId!)
    },
  })
}
