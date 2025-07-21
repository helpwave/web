import type {
  OrganizationDTO,
  OrganizationMinimalDTO,
  OrganizationWithMinimalMemberDTO
} from '../../types/users/organizations'
import {
  CreateOrganizationRequest,
  CreatePersonalOrganizationRequest,
  DeleteOrganizationRequest,
  GetOrganizationRequest,
  GetOrganizationsForUserRequest,
  UpdateOrganizationRequest
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export const OrganizationService = {
  get: async (id: string): Promise<OrganizationWithMinimalMemberDTO> => {
    const req = new GetOrganizationRequest()
      .setId(id)

    const res = await APIServices.organization.getOrganization(req, getAuthenticatedGrpcMetadata())

    return {
      ...res.toObject(),
      members: res.getMembersList().map(member => ({
        ...member.toObject(),
      }))
    }
  },
  getForUser: async (): Promise<OrganizationDTO[]> => {
    const req = new GetOrganizationsForUserRequest()
    const res = await APIServices.organization.getOrganizationsForUser(req, getAuthenticatedGrpcMetadata())

    return res.getOrganizationsList().map(organization => ({
      ...organization.toObject(),
      avatarURL: 'https://cdn.helpwave.de/boringavatar.svg', // TODO remove later
      members: organization.getMembersList().map(member => ({
        ...member.toObject(),
        avatarURL: 'https://cdn.helpwave.de/boringavatar.svg', // TODO remove later
      }))
    }))
  },
  create: async (organization: OrganizationMinimalDTO): Promise<OrganizationMinimalDTO> => {
    const req = new CreateOrganizationRequest()
      .setLongName(organization.longName)
      .setShortName(organization.shortName)
      .setIsPersonal(organization.isPersonal)
      .setContactEmail(organization.contactEmail)
    const res = await APIServices.organization.createOrganization(req, getAuthenticatedGrpcMetadata())

    return { ...organization, id: res.getId() }
  },
  createPersonal: async (): Promise<string> => {
    const req = new CreatePersonalOrganizationRequest()
    const res = await APIServices.organization.createPersonalOrganization(req, getAuthenticatedGrpcMetadata())
    return res.getId()
  },
  update: async (organization: OrganizationMinimalDTO): Promise<OrganizationMinimalDTO> => {
    const req = new UpdateOrganizationRequest()
      .setId(organization.id)
      .setLongName(organization.longName)
      .setShortName(organization.shortName)
      .setIsPersonal(organization.isPersonal)
      .setContactEmail(organization.contactEmail)

    if(organization.avatarURL) {
      req.setAvatarUrl(organization.avatarURL)
    }
    await APIServices.organization.updateOrganization(req, getAuthenticatedGrpcMetadata())

    return organization
  },
  delete: async (id: string): Promise<boolean> => {
    const req = new DeleteOrganizationRequest()
      .setId(id)
    await APIServices.organization.deleteOrganization(req, getAuthenticatedGrpcMetadata())
    return true
  }
}
