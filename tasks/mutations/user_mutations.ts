import { useQuery } from '@tanstack/react-query'
import { ReadPublicProfileRequest, ReadSelfRequest } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_pb'
import { getAuthenticatedGrpcMetadata, grpcWrapper, userService } from '../utils/grpc'

const userQueryKey = 'user'

export const useUserQuery = (userId: string|undefined) => {
  const enabled = !!userId && userId !== '00000000-0000-0000-0000-000000000000'
  return useQuery({
    queryKey: [userQueryKey, userId],
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      if (!enabled || !userId) return
      const req = new ReadPublicProfileRequest()
      req.setId(userId)

      const res = await userService.readPublicProfile(req, getAuthenticatedGrpcMetadata())
      return res.toObject()
    },
  })
}

export const useReadSelfQuery = () => {
  return useQuery({
    queryKey: [ 'useReadSelfQuery' ],
    queryFn: async () => {
      const req = new ReadSelfRequest()

      // const res = await grpcWrapper(userService.readSelf.bind(userService), req)
      const res = await userService.readSelf(req, getAuthenticatedGrpcMetadata())

      return res.toObject()
    },
  })
}
