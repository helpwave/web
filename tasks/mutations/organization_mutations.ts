import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AcceptInvitationRequest, AddMemberRequest,
  CreateOrganizationRequest, DeclineInvitationRequest, DeleteOrganizationRequest,
  GetOrganizationRequest, GetOrganizationsByUserRequest,
  InviteMemberRequest, RemoveMemberRequest, UpdateOrganizationRequest
} from '@helpwave/proto-ts/proto/services/user_svc/v1/organization_svc_pb'
import { getAuthenticatedGrpcMetadata, organizationService } from '../utils/grpc'
import type { OrgMember, OrgMemberMinimalDTO } from './organization_member_mutations'
import type { WardDTO } from './ward_mutations'

export type OrganizationWitWardNamesDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  wardNames: string[],
  members: OrgMember[]
}

export type OrganizationDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  wards: WardDTO[],
  members: OrgMember[]
}

export type OrganizationMinimalDTO = {
  id: string,
  longName: string,
  shortName: string,
  contactEmail: string,
  avatarUrl: string,
  isPersonal: boolean,
  membersList: OrgMemberMinimalDTO[]
}

export const emptyOrganizationMinimal = {
  id: '',
  longName: '',
  shortName: '',
  contactEmail: '',
  avatarUrl: '',
  isPersonal: true,
  membersList: []
}

export const organizationQueryKey = 'organizations'
export const organizationInvitesQueryKey = 'organizationInvites'

export const useOrganizationQuery = (organizationID: string | undefined) => {
  return useQuery({
    queryKey: [organizationQueryKey],
    enabled: !!organizationID,
    queryFn: async () => {
      if (!organizationID) {
        return
      }
      const req = new GetOrganizationRequest()
      req.setId(organizationID)

      const res = await organizationService.getOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('inviteMember failed')
      }

      const organization: OrganizationMinimalDTO = {
        id: res.getId(),
        contactEmail: res.getContactEmail(),
        isPersonal: res.getIsPersonal(),
        avatarUrl: res.getAvatarUrl(),
        longName: res.getLongName(),
        shortName: res.getShortName(),
        membersList: res.getMembersList().map(member => ({
          id: member.getUserId()
        }))
      }
      return organization
    },
  })
}

// TODO update when backend is fixed
export const useOrganizationsByUserQuery = (userID: string | undefined) => {
  return useQuery({
    queryKey: [organizationQueryKey],
    enabled: !!userID,
    queryFn: async () => {
      if (!userID) {
        return []
      }

      return []
      const req = new GetOrganizationsByUserRequest()
      req.setUserId(userID)

      const res = await organizationService.getOrganizationsByUser(req, getAuthenticatedGrpcMetadata())

      if (!res.getId()) {
        // TODO some check whether request was successful
        console.error('inviteMember failed')
      }

      /* TODO use later
      const organizations: OrganizationMinimalDTO[] = res.getOrganizationsList().map(value => ({
        id: value.getId(),
        contactEmail: value.getContactEmail(),
        isPersonal: value.getIsPersonal(),
        avatarUrl: value.getAvatarUrl(),
        longName: value.getLongName(),
        shortName: value.getShortName(),
        membersList: value.getMembersList().map(value => ({
          id: value.getUserId()
        }))
      }))
      return organizations
      */
      return []
    },
  })
}

export const useOrganizationCreateMutation = (callback: (organization: OrganizationMinimalDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationMinimalDTO) => {
      const req = new CreateOrganizationRequest()
      req.setContactEmail(organization.contactEmail)
      req.setIsPersonal(organization.isPersonal)
      req.setLongName(organization.longName)
      req.setShortName(organization.shortName)

      const res = await organizationService.createOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('inviteMember failed')
      }

      const updatedOrganization:OrganizationMinimalDTO = { ...organization }
      callback(updatedOrganization)
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    },
  })
}

export const useOrganizationUpdateMutation = (callback: (organization: OrganizationMinimalDTO) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationMinimalDTO) => {
      const req = new UpdateOrganizationRequest()
      req.setId(organization.id)
      req.setContactEmail(organization.contactEmail)
      req.setAvatarUrl(organization.avatarUrl)
      req.setIsPersonal(organization.isPersonal)
      req.setLongName(organization.longName)
      req.setShortName(organization.shortName)

      const res = await organizationService.updateOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('inviteMember failed')
      }

      const updatedOrganization:OrganizationMinimalDTO = { ...organization }
      callback(updatedOrganization)
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    },
  })
}

export const useOrganizationDeleteMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organizationID: string) => {
      const req = new DeleteOrganizationRequest()
      req.setId(organizationID)

      const res = await organizationService.deleteOrganization(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('inviteMember failed')
      }

      callback()
      queryClient.refetchQueries({ queryKey: [organizationQueryKey] }).then()
    },
  })
}

export const useInviteMemberMutation = (callback: (inviteID: string) => void, organizationID: string) => {
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

export const useAcceptInvitationMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const req = new AcceptInvitationRequest()
      req.setInvitationId(invitationId)

      const res = await organizationService.acceptInvitation(req, getAuthenticatedGrpcMetadata())

      if (!res.toObject()) {
        // TODO some check whether request was successful
        console.error('AcceptInvitation failed')
      }
      queryClient.refetchQueries({ queryKey: [organizationInvitesQueryKey] }).then()
      callback()
      return res.toObject()
    },
  })
}

export const useDeclineInvitationMutation = (callback: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const req = new DeclineInvitationRequest()
      req.setInvitationId(invitationId)

      const res = await organizationService.declineInvitation(req, getAuthenticatedGrpcMetadata())

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
