import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type { OrganizationMember } from '../../types/users/organization_member'
import { GetMembersByOrganizationRequest } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'

export const OrganizationMemberService = {
  getByOrganization: async (id: string): Promise<OrganizationMember[]> => {
    const req = new GetMembersByOrganizationRequest()
    .setId(id)

    const res = await APIServices.organization.getMembersByOrganization(req, getAuthenticatedGrpcMetadata())

    return res.getMembersList().map(member => ({
      ...member.toObject(),
      avatarURL: 'https://cdn.helpwave.de/boringavatar.svg', // TODO remove later
    }))
  },
}
