import { useQuery } from '@tanstack/react-query'
import { GetMembersByOrganizationRequest } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import { QueryKeys } from '../query_keys'
import type { OrganizationMember } from '../../types/users/organization_member'

export const useMembersByOrganizationQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.organizations, organizationId, 'members'],
    enabled: !!organizationId,
    queryFn: async () => {
      if (!organizationId) {
        return []
      }

      const req = new GetMembersByOrganizationRequest()
      req.setId(organizationId)

      const res = await APIServices.organization.getMembersByOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in MembersByOrganization')
      }

      const members: OrganizationMember[] = res.getMembersList().map(member => ({
        id: member.getUserId(),
        name: member.getNickname(),
        email: member.getEmail(),
        avatarURL: member.getAvatarUrl(),
      }))
      return members
    },
  })
}
