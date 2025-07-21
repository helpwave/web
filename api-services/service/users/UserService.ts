import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { ReadPublicProfileRequest } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_pb'
import type { User } from '../../types/users/user'

export const UserService = {
  get: async (id: string): Promise<User> => {
    const req = new ReadPublicProfileRequest()
      .setId(id)

    const res = await APIServices.user.readPublicProfile(req, getAuthenticatedGrpcMetadata())
    return {
      ...res.toObject(),
      avatarUrl: `https://cdn.helpwave.de/boringavatar.svg`
    }
  },
}
