import type {
  OrganizationDTO,
  OrganizationMinimalDTO,
  OrganizationWithMinimalMemberDTO
} from '../../types/users/organizations'
import {
  CreateOrganizationRequest, CreatePersonalOrganizationRequest, DeleteOrganizationRequest,
  GetOrganizationRequest,
  GetOrganizationsForUserRequest, UpdateOrganizationRequest
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export const OrganizationService = {
  create: async (organization: OrganizationMinimalDTO): Promise<OrganizationMinimalDTO> => {
    const req = new CreateOrganizationRequest()
    req.setLongName(organization.longName)
    req.setShortName(organization.shortName)
    req.setIsPersonal(organization.isPersonal)
    req.setContactEmail(organization.email)
    const res = await APIServices.organization.createOrganization(req, getAuthenticatedGrpcMetadata())

    return { ...organization, id: res.getId() }
  },
  createPersonal: async (): Promise<string> => {
    const req = new CreatePersonalOrganizationRequest()
    const res = await APIServices.organization.createPersonalOrganization(req, getAuthenticatedGrpcMetadata())
    return res.getId()
  },
  delete: async (id: string): Promise<boolean> => {
    const req = new DeleteOrganizationRequest()
    req.setId(id)
    await APIServices.organization.deleteOrganization(req, getAuthenticatedGrpcMetadata())
    return true
  },
  get: async (id: string): Promise<OrganizationWithMinimalMemberDTO> => {
    const req = new GetOrganizationRequest()
    req.setId(id)

    const res = await APIServices.organization.getOrganization(req, getAuthenticatedGrpcMetadata())

    return {
      id: res.getId(),
      email: res.getContactEmail(),
      isVerified: true, // TODO update later
      longName: res.getLongName(),
      shortName: res.getShortName(),
      isPersonal: res.getIsPersonal(),
      avatarURL: res.getAvatarUrl(),
      members: res.getMembersList().map(member => ({ id: member.getUserId() }))
    }
  },
  getForUser:
    async (): Promise<OrganizationDTO[]> => {
      const req = new GetOrganizationsForUserRequest()
      const res = await APIServices.organization.getOrganizationsForUser(req, getAuthenticatedGrpcMetadata())

      return res.getOrganizationsList().map(organization => ({
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
    },
  update: async (organization: OrganizationMinimalDTO): Promise<OrganizationMinimalDTO> => {
    const req = new UpdateOrganizationRequest()
    req.setId(organization.id)
    req.setLongName(organization.longName)
    req.setShortName(organization.shortName)
    req.setIsPersonal(organization.isPersonal)
    req.setAvatarUrl(organization.avatarURL)
    req.setContactEmail(organization.email)
    await APIServices.organization.updateOrganization(req, getAuthenticatedGrpcMetadata())

    return organization
  }
}
