import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreatePersonalOrganizationResponse,
  InvitationState
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import {
  AcceptInvitationRequest,
  CreateOrganizationRequest,
  CreatePersonalOrganizationRequest,
  DeclineInvitationRequest,
  DeleteOrganizationRequest,
  GetInvitationsByOrganizationRequest,
  GetInvitationsByUserRequest,
  GetOrganizationRequest,
  GetOrganizationsForUserRequest,
  InviteMemberRequest,
  RemoveMemberRequest,
  RevokeInvitationRequest,
  UpdateOrganizationRequest
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { noop } from '@helpwave/hightide'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata, grpcWrapper } from '../../authentication/grpc_metadata'
import type {
  OrganizationDTO,
  OrganizationMinimalDTO,
  OrganizationWithMinimalMemberDTO
} from '../../types/users/organizations'
import type { Invitation, InvitationWithOrganizationId, InviteMemberType } from '../../types/users/invitations'

export const useOrganizationQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.organizations, organizationId, 'get'],
    enabled: !!organizationId,
    queryFn: async () => {
      const req = new GetOrganizationRequest()
      // TODO: would `organizationId !== undefined` also work here or are empty strings also possible?
      if (organizationId) {
        req.setId(organizationId)
      }

      const res = await APIServices.organization.getOrganization(req, getAuthenticatedGrpcMetadata())

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

export const useOrganizationsForUserQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.organizations, 'organizationsForUser'],
    queryFn: async () => {
      const req = new GetOrganizationsForUserRequest()
      const res = await APIServices.organization.getOrganizationsForUser(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('OrganizationsByUser failed')
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
        }))
      }))
      return organizations
    },
  })
}

export const userInvitationQueryKey = 'userInvitation'
export const useInvitationsByUserQuery = (state?: InvitationState) => {
  return useQuery({
    queryKey: [QueryKeys.invitations, userInvitationQueryKey],
    queryFn: async () => {
      const req = new GetInvitationsByUserRequest()
      if (state) {
        req.setState(state)
      }
      const res = await APIServices.organization.getInvitationsByUser(req, getAuthenticatedGrpcMetadata())

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

export const useInvitationsByOrganizationQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.invitations, QueryKeys.organizations],
    enabled: !!organizationId,
    queryFn: async () => {
      // TODO update later
      const req = new GetInvitationsByOrganizationRequest()
      if (organizationId) {
        req.setOrganizationId(organizationId)
      }
      const res = await APIServices.organization.getInvitationsByOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        console.error('error in OrganizationCreate')
      }

      const invitations: InvitationWithOrganizationId[] = res.getInvitationsList().map(invite => ({
        id: invite.getId(),
        email: invite.getEmail(),
        organizationId: invite.getOrganizationId(),
        state: invite.getState()
      }))
      return invitations
    },
  })
}

export const useOrganizationCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationMinimalDTO) => {
      const req = new CreateOrganizationRequest()
      req.setLongName(organization.longName)
      req.setShortName(organization.shortName)
      req.setIsPersonal(organization.isPersonal)
      req.setContactEmail(organization.email)
      const res = await APIServices.organization.createOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('error in OrganizationCreate')
      }

      return { ...organization, id: res.getId() }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.organizations] }).catch(console.error)
    }
  })
}

export const useOrganizationUpdateMutation = () => {
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
      const res = await APIServices.organization.updateOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        throw new Error('error in OrganizationUpdate')
      }

      return organization
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.organizations] }).catch(console.error)
    }
  })
}

export const useOrganizationDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const req = new DeleteOrganizationRequest()
      req.setId(organizationId)
      const res = await APIServices.organization.deleteOrganization(req, getAuthenticatedGrpcMetadata())

      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('error in OrganizationDelete')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.organizations] }).catch(console.error)
    },
  })
}

export const useInviteDeclineMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const req = new DeclineInvitationRequest()
      req.setInvitationId(inviteId)
      const res = await APIServices.organization.declineInvitation(req, getAuthenticatedGrpcMetadata())

      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('error in InviteDecline')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.invitations] }).catch(console.error)
    },
  })
}

export const useInviteRevokeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const req = new RevokeInvitationRequest()
      req.setInvitationId(inviteId)
      const res = await APIServices.organization.revokeInvitation(req, getAuthenticatedGrpcMetadata())

      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('error in InviteDecline')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.invitations] }).catch(console.error)
    },
  })
}

export const useInviteMemberMutation = (organizationId: string, callback: (inviteId: string) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (invite: InviteMemberType) => {
      const req = new InviteMemberRequest()

      if (!organizationId) {
        if (invite.organizationId) {
          organizationId = invite.organizationId
        } else {
          console.error('InviteMember failed, provide an non null organization id either in the mutate or the hook')
        }
      }
      req.setEmail(invite.email)
      req.setOrganizationId(organizationId)

      const res = await APIServices.organization.inviteMember(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        throw new Error('InviteMember failed')
      }

      callback(res.getId())
      return res.toObject()
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.invitations] }).catch(console.error)
    }
  })
}

export const useInviteAcceptMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const req = new AcceptInvitationRequest()
      req.setInvitationId(inviteId)
      const res = await APIServices.organization.acceptInvitation(req, getAuthenticatedGrpcMetadata())
      const obj = res.toObject()

      if (!obj) {
        throw new Error('error in InviteAccept')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.invitations] }).catch(console.error)
    },
  })
}

export const useRemoveMemberMutation = (organizationId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const req = new RemoveMemberRequest()
      req.setId(organizationId)
      req.setUserId(userId)

      const res = await APIServices.organization.removeMember(req, getAuthenticatedGrpcMetadata())
      const obj = res.toObject() // TODO: what is the type of this?

      if (!obj) {
        throw new Error('DeclineInvitation failed')
      }

      return obj
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [QueryKeys.invitations] }).catch(console.error)
    }
  })
}

export const createPersonalOrganization = async (): Promise<CreatePersonalOrganizationResponse.AsObject> => {
  const req = new CreatePersonalOrganizationRequest()

  const res = await grpcWrapper(APIServices.organization.createPersonalOrganization, req)
  const obj = res.toObject()

  if (!obj) {
    throw new Error('CreatePersonalOrganization failed')
  }

  return obj
}
