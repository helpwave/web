import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InvitationState } from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import {
  AcceptInvitationRequest,
  CreateOrganizationRequest, DeclineInvitationRequest,
  DeleteOrganizationRequest,
  GetInvitationsByUserRequest,
  GetOrganizationRequest, GetOrganizationsByUserRequest, UpdateOrganizationRequest,
  InviteMemberRequest, RemoveMemberRequest, AddMemberRequest
} from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { getAuthenticatedGrpcMetadata, organizationService } from '../utils/grpc'
import { noop } from '@helpwave/common/util/noop'
import { Role } from './organization_member_mutations'

export const organizationQueryKey = 'organizations'
export const organizationInvitesQueryKey = 'organizationInvites'

export type OrgMemberMinimalDTO = {
  id: string
}

export type OrgMember = OrgMemberMinimalDTO & {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

export type OrganizationMinimalDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  isPersonal: boolean,
  avatarURL: string
}

export type OrganizationDTO = OrganizationMinimalDTO & {
  members: OrgMember[]
}

export const emptyOrganization: OrganizationDTO = {
  id: '',
  shortName: '',
  longName: '',
  email: '',
  avatarURL: '',
  isPersonal: false,
  isVerified: false,
  members: []
}

export type OrganizationWithMinimalMemberDTO = OrganizationMinimalDTO & {
  members: OrgMemberMinimalDTO[]
}

export type OrganizationDisplayableDTO = {
  id: string,
  longName: string,
  avatarURL: string
}

export type Invitation = {
  id: string,
  email: string,
  organization: OrganizationDisplayableDTO,
  state: InvitationState
}

export const useOrganizationQuery = (organizationID: string | undefined) => {
  return useQuery({
    queryKey: [organizationQueryKey],
    enabled: !!organizationID,
    queryFn: async () => {
      const req = new GetOrganizationRequest()
      if (organizationID) {
        req.setId(organizationID)
      }

      const res = await organizationService.getOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in Organization')
      }

      const organization: OrganizationWithMinimalMemberDTO = {
        id: res.getId(),
        email: res.getContactEmail(),
        isVerified: true, // TODO update later
        longName: res.getLongName(),
        shortName: res.getShortName(),
        isPersonal: res.getIsPersonal(),
        avatarURL: res.getAvatarUrl(),
        members: res.getMembersList().map(member => ({ id: member.getUserId() }))
      }
      return organization
    },
  })
}

export const useOrganizationsByUserQuery = () => {
  return useQuery({
    queryKey: [organizationQueryKey],
    queryFn: async () => {
      const req = new GetOrganizationsByUserRequest()

      // TODO
      const res = await organizationService.getOrganizationsByUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('inviteMember failed')
      }

      const organizations: OrganizationDTO[] = res.getOrganizationsList().map(organization => ({
        id: organization.getId(),
        email: organization.getContactEmail(),
        isPersonal: organization.getIsPersonal(),
        avatarUrl: organization.getAvatarUrl(),
        longName: organization.getLongName(),
        shortName: organization.getShortName(),
        avatarURL: organization.getAvatarUrl(),
        isVerified: true, // TODO change Later
        members: organization.getMembersList().map(member => ({
          id: member.getUserId(),
          email: member.getEmail(),
          name: member.getNickname(),
          avatarURL: member.getAvatarUrl(),
          role: Role.admin // TODO change later
        }))
      }))
      return organizations
    },
  })
}

export const invitationsQueryKey = 'invitations'
export const useInvitationsByUserQuery = (state?: InvitationState) => {
  return useQuery({
    queryKey: [organizationQueryKey, invitationsQueryKey],
    queryFn: async () => {
      const req = new GetInvitationsByUserRequest()
      if (state) {
        req.setState(state)
      }
      const res = await organizationService.getInvitationsByUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in InvitationsByUser')
      }

      const invitations: Invitation[] = res.getInvitationsList().map(invite => {
        const organization = invite.getOrganization()
        return {
          id: invite.getId(),
          state: invite.getState() as InvitationState, // TODO change later to enum
          email: invite.getEmail(),
          organization: {
            id: organization?.getId() ?? '',
            avatarURL: organization?.getAvatarUrl() ?? '',
            longName: organization?.getLongName() ?? ''
          }
        }
      })
      return invitations
    },
  })
}

export const useOrganizationCreateMutation = (callback: (organization: OrganizationMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationMinimalDTO) => {
      const req = new CreateOrganizationRequest()
      req.setLongName(organization.longName)
      req.setShortName(organization.shortName)
      req.setIsPersonal(organization.isPersonal)
      req.setContactEmail(organization.email)
      const res = await organizationService.createOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in OrganizationCreate')
      }

      const newOrganization: OrganizationMinimalDTO = { ...organization, id: res.getId() }
      callback(newOrganization)
      return newOrganization
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    }
  })
}

export const useOrganizationUpdateMutation = (callback: (organization: OrganizationMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationMinimalDTO) => {
      const req = new UpdateOrganizationRequest()
      req.setId(organization.id)
      req.setLongName(organization.longName)
      req.setShortName(organization.shortName)
      req.setIsPersonal(organization.isPersonal)
      req.setAvatarUrl(organization.avatarURL)
      req.setContactEmail(organization.email)
      const res = await organizationService.updateOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in OrganizationUpdate')
      }

      const newOrganization: OrganizationMinimalDTO = { ...organization }
      callback(newOrganization)
      return newOrganization
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    }
  })
}

export const useOrganizationDeleteMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organizationID: string) => {
      const req = new DeleteOrganizationRequest()
      req.setId(organizationID)
      const res = await organizationService.deleteOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in OrganizationDelete')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    },
  })
}

export const useInviteDeclineMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteID: string) => {
      const req = new DeclineInvitationRequest()
      req.setInvitationId(inviteID)
      const res = await organizationService.declineInvitation(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in InviteDecline')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [organizationQueryKey, invitationsQueryKey] }).then()
    },
  })
}

export const useInviteMemberMutation = (organizationID: string, callback: (inviteID: string) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (email: string) => {
      const req = new InviteMemberRequest()
      req.setEmail(email)
      req.setOrganizationId(organizationID)

      const res = await organizationService.inviteMember(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('InviteMember failed')
      }
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
      queryClient.refetchQueries({ queryKey: [organizationInvitesQueryKey] }).then()
      callback(res.getId())
      return res.toObject()
    },
  })
}

export const useInviteAcceptMutation = (callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteID: string) => {
      const req = new AcceptInvitationRequest()
      req.setInvitationId(inviteID)
      const res = await organizationService.acceptInvitation(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in InviteAccept')
      }

      callback()
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [organizationQueryKey, invitationsQueryKey] }).then()
    },
  })
}

export const useAddMemberMutation = (callback: () => void, organizationID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userID: string) => {
      const req = new AddMemberRequest()
      req.setId(organizationID)
      req.setUserId(userID)

      const res = await organizationService.addMember(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('DeclineInvitation failed')
      }
      queryClient.refetchQueries({ queryKey: [organizationInvitesQueryKey] }).then()
      callback()
      return res.toObject()
    },
  })
}

export const useRemoveMemberMutation = (callback: () => void, organizationID: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userID: string) => {
      const req = new RemoveMemberRequest()
      req.setId(organizationID)
      req.setUserId(userID)

      const res = await organizationService.removeMember(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('DeclineInvitation failed')
      }
      queryClient.refetchQueries({ queryKey: [organizationInvitesQueryKey] }).then()
      callback()
      return res.toObject()
    },
  })
}
