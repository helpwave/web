import { useQuery } from '@tanstack/react-query'
import { GetMembersByOrganizationRequest } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { getAuthenticatedGrpcMetadata, organizationService } from '../utils/grpc'

// TODO replace later
export const enum Role {
  user,
  admin,
}

export type OrgMember = {
  id: string,
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

export type OrgMemberMinimalDTO = {
  id: string
}

const membersQueryKey = 'membersQueryKey'
export const useMembersByOrganizationQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: [membersQueryKey],
    enabled: !!organizationId,
    queryFn: async () => {
      if (!organizationId) {
        return []
      }

      const req = new GetMembersByOrganizationRequest()
      req.setId(organizationId)

      const res = await organizationService.getMembersByOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in MembersByOrganization')
      }

      const members: OrgMember[] = res.getMembersList().map(member => ({
        id: member.getUserId(),
        name: member.getNickname(),
        email: member.getEmail(),
        avatarURL: member.getAvatarUrl(),
        role: Role.admin, // TODO update this
      }))
      return members
    },
  })
}
