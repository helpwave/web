import { useQuery } from '@tanstack/react-query'
import { organizationQueryKey } from './organization_mutations'

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

// TODO MembersByOrganization
export const useMembersByOrganizationQuery = (organizationID: string | undefined) => {
  return useQuery({
    queryKey: [organizationQueryKey],
    enabled: !!organizationID,
    queryFn: async () => {
      if (!organizationID) {
        return []
      }
      const members: OrgMember[] = []
      return members
    },
  })
}
