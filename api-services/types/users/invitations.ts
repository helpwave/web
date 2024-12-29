import type { InvitationState } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import type { OrganizationDisplayableDTO } from './organizations'
export { InvitationState } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'

export type InvitationWithOrganizationId = {
  id: string,
  email: string,
  organizationId: string,
  state: InvitationState,
}

export type Invitation = {
  id: string,
  email: string,
  organization: OrganizationDisplayableDTO,
  state: InvitationState,
}

export type InviteMemberType = { email: string, organizationId?: string }
