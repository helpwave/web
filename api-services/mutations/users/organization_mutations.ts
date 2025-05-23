import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  InvitationState
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import {
  AcceptInvitationRequest,
  DeclineInvitationRequest,
  GetInvitationsByOrganizationRequest,
  GetInvitationsByUserRequest,
  InviteMemberRequest,
  RemoveMemberRequest,
  RevokeInvitationRequest
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { noop } from '@helpwave/hightide'
import { QueryKeys } from '../query_keys'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type {
  OrganizationMinimalDTO
} from '../../types/users/organizations'
import type { Invitation, InvitationWithOrganizationId, InviteMemberType } from '../../types/users/invitations'
import { OrganizationService } from '../../service/users/OrganizationService'

export const useOrganizationQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: [QueryKeys.organizations, organizationId, 'get'],
    enabled: !!organizationId,
    queryFn: async () => {
      return await OrganizationService.get(organizationId!)
    },
  })
}

export const useOrganizationsForUserQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.organizations, 'organizationsForUser'],
    queryFn: async () => {
      return await OrganizationService.getForUser()
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
      return await OrganizationService.create(organization)
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
      return await OrganizationService.update(organization)
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
      return await OrganizationService.delete(organizationId)
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

      const obj = res.toObject()

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

      const obj = res.toObject()

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
      const obj = res.toObject()

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
