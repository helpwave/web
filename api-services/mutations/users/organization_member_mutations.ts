import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../query_keys'
import { useAuth } from '../../authentication/useAuth'
import { OrganizationMemberService } from '../../service/users/OrganizationMemberService'

export const useMembersByOrganizationQuery = () => {
  const { organization } = useAuth()
  const organizationId = organization?.id
  return useQuery({
    queryKey: [QueryKeys.organizations, organizationId, 'members'],
    enabled: !!organizationId,
    queryFn: async () => {
      return await OrganizationMemberService.getByOrganization(organizationId!)
    },
  })
}
