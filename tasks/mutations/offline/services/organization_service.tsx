import type { Metadata } from 'grpc-web'
import { OrganizationServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_grpc_web_pb'
import type {
  CreateOrganizationRequest,
  GetMembersByOrganizationRequest,
  GetOrganizationRequest,
  GetOrganizationsByUserRequest,
  GetOrganizationsForUserRequest,
  CreateOrganizationForUserRequest,
  UpdateOrganizationRequest,
  DeleteOrganizationRequest,
  GetInvitationsByOrganizationRequest,
  InviteMemberRequest,
  InviteMemberResponse,
  GetInvitationsByUserRequest,
  RevokeInvitationRequest,
  AcceptInvitationRequest,
  DeclineInvitationRequest, AddMemberRequest, RemoveMemberRequest, AddMemberResponse, RemoveMemberResponse
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import {
  AcceptInvitationResponse,
  CreateOrganizationForUserResponse,
  CreateOrganizationResponse, DeclineInvitationResponse,
  DeleteOrganizationResponse,
  GetInvitationsByOrganizationResponse, GetInvitationsByUserResponse,
  GetMembersByOrganizationResponse,
  GetOrganizationMember,
  GetOrganizationResponse,
  GetOrganizationsByUserResponse,
  GetOrganizationsForUserResponse, RevokeInvitationResponse,
  UpdateOrganizationResponse
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_pb'
import { OfflineValueStore } from '@/mutations/offline/value_store'
import type { OrganizationMinimalDTO } from '@/mutations/organization_mutations'
import { UserOfflineService } from '@/mutations/offline/services/user_service'
import { WardOfflineService } from '@/mutations/offline/services/ward_service'

type OrganizationUpdate = Omit<OrganizationMinimalDTO, 'isPersonal'>

export const OrganizationOfflineService = {
  find: (id: string): OrganizationMinimalDTO | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.organizations.find(value => value.id === id)
  },
  findOrganizations: (): OrganizationMinimalDTO[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.organizations
  },
  create: (organization: OrganizationMinimalDTO) => {
    OfflineValueStore.getInstance().organizations.push(organization)
  },
  update: (organization: OrganizationUpdate) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()

    let found = false

    // TODO check organization
    valueStore.organizations = valueStore.organizations.map(value => {
      if (value.id === organization.id) {
        found = true
        return {
          ...value,
          ...organization
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdateOrganization: Could not find organization with id ${organization.id}`)
    }
  },
  delete: (organizationId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.organizations = valueStore.organizations.filter(value => value.id !== organizationId)
    const wards = WardOfflineService.findWards(organizationId)
    wards.forEach(ward => WardOfflineService.delete(ward.id))
  }
}

export class OrganizationOfflineServicePromiseClient extends OrganizationServicePromiseClient {
  async getOrganization(request: GetOrganizationRequest, _?: Metadata): Promise<GetOrganizationResponse> {
    const organization = OrganizationOfflineService.find(request.getId())
    if (!organization) {
      throw Error(`GetOrganization: Could not find organization with id ${request.getId()}`)
    }
    const members = UserOfflineService.findUsers().map(user => new GetOrganizationMember().setUserId(user.id))
    return new GetOrganizationResponse()
      .setId(organization.id)
      .setShortName(organization.shortName)
      .setLongName(organization.longName)
      .setAvatarUrl(organization.avatarURL)
      .setContactEmail(organization.email)
      .setIsPersonal(organization.isPersonal)
      .setMembersList(members)
  }

  async getOrganizationsByUser(_: GetOrganizationsByUserRequest, __?: Metadata): Promise<GetOrganizationsByUserResponse> {
    // TODO use user id of request
    const organizations = OrganizationOfflineService.findOrganizations().map(org =>
      new GetOrganizationsByUserResponse.Organization()
        .setId(org.id)
        .setShortName(org.shortName)
        .setLongName(org.longName)
        .setContactEmail(org.email)
        .setIsPersonal(org.isPersonal)
        .setAvatarUrl(org.avatarURL)
        .setMembersList(UserOfflineService.findUsers().map(user => new GetOrganizationsByUserResponse.Organization.Member().setUserId(user.id))))
    return new GetOrganizationsByUserResponse().setOrganizationsList(organizations)
  }

  async getOrganizationsForUser(_: GetOrganizationsForUserRequest, __?: Metadata): Promise<GetOrganizationsForUserResponse> {
    const organizations = OrganizationOfflineService.findOrganizations().map(org =>
      new GetOrganizationsByUserResponse.Organization()
        .setId(org.id)
        .setShortName(org.shortName)
        .setLongName(org.longName)
        .setContactEmail(org.email)
        .setIsPersonal(org.isPersonal)
        .setAvatarUrl(org.avatarURL)
        .setMembersList(UserOfflineService.findUsers().map(user => new GetOrganizationsForUserResponse.Organization.Member().setUserId(user.id))))
    return new GetOrganizationsForUserResponse().setOrganizationsList(organizations)
  }

  async getMembersByOrganization(request: GetMembersByOrganizationRequest, __?: Metadata): Promise<GetMembersByOrganizationResponse> {
    const organization = OrganizationOfflineService.find(request.getId())
    if (!organization) {
      throw Error(`GetMembersByOrganization: Could not find organization with id ${request.getId()}`)
    }
    const members = UserOfflineService.findUsers().map(user => new GetMembersByOrganizationResponse.Member()
      .setUserId(user.id)
      .setEmail(user.email)
      .setNickname(user.nickName)
      .setAvatarUrl(user.avatarURL))
    return new GetMembersByOrganizationResponse().setMembersList(members)
  }

  async createOrganization(request: CreateOrganizationRequest, _?: Metadata): Promise<CreateOrganizationResponse> {
    const newOrganization: OrganizationMinimalDTO = {
      id: Math.random().toString(),
      shortName: request.getShortName(),
      longName: request.getLongName(),
      avatarURL: 'https://helpwave.de/favicon.ico',
      email: request.getContactEmail(),
      isPersonal: request.getIsPersonal(),
      isVerified: true
    }

    OrganizationOfflineService.create(newOrganization)

    return new CreateOrganizationResponse().setId(newOrganization.id)
  }

  async createOrganizationForUser(request: CreateOrganizationForUserRequest, _?: Metadata): Promise<CreateOrganizationForUserResponse> {
    const newOrganization: OrganizationMinimalDTO = {
      id: Math.random().toString(),
      shortName: request.getShortName(),
      longName: request.getLongName(),
      avatarURL: 'https://helpwave.de/favicon.ico',
      email: request.getContactEmail(),
      isPersonal: request.getIsPersonal(),
      isVerified: true
    }

    OrganizationOfflineService.create(newOrganization)

    return new CreateOrganizationForUserResponse().setId(newOrganization.id)
  }

  async updateOrganization(request: UpdateOrganizationRequest, _?: Metadata): Promise<UpdateOrganizationResponse> {
    const update: OrganizationUpdate = {
      id: request.getId(),
      shortName: request.getShortName(),
      longName: request.getLongName(),
      email: request.getContactEmail(),
      isVerified: request.getIsPersonal(),
      avatarURL: request.getAvatarUrl(),
    }
    OrganizationOfflineService.update(update)
    return new UpdateOrganizationResponse()
  }

  async deleteOrganization(request: DeleteOrganizationRequest, _?: Metadata): Promise<DeleteOrganizationResponse> {
    OrganizationOfflineService.delete(request.getId())
    return new DeleteOrganizationResponse()
  }

  async getInvitationsByOrganization(__: GetInvitationsByOrganizationRequest, _?: Metadata): Promise<GetInvitationsByOrganizationResponse> {
    // TODO update this
    return new GetInvitationsByOrganizationResponse().setInvitationsList([])
  }

  async getInvitationsByUser(__: GetInvitationsByUserRequest, _?: Metadata): Promise<GetInvitationsByUserResponse> {
    // TODO update this
    return new GetInvitationsByUserResponse().setInvitationsList([])
  }

  async inviteMember(__: InviteMemberRequest, _?: Metadata): Promise<InviteMemberResponse> {
    // TODO update this
    throw Error('Not implemented')
    // return new InviteMemberResponse()
  }

  async revokeInvitation(__: RevokeInvitationRequest, _?: Metadata): Promise<RevokeInvitationResponse> {
    // TODO update this
    return new RevokeInvitationResponse()
  }

  async acceptInvitation(__: AcceptInvitationRequest, _?: Metadata): Promise<AcceptInvitationResponse> {
    // TODO update this
    return new AcceptInvitationResponse()
  }

  async declineInvitation(__: DeclineInvitationRequest, _?: Metadata): Promise<DeclineInvitationResponse> {
    // TODO update this
    return new DeclineInvitationResponse()
  }

  async addMember(__: AddMemberRequest, _?: Metadata): Promise<AddMemberResponse> {
    // TODO update this
    throw Error('Not implemented')
    // return new AddMemberResponse()
  }

  removeMember(__: RemoveMemberRequest, _?: Metadata): Promise<RemoveMemberResponse> {
    // TODO update this
    throw Error('Not implemented')
    // return new RemoveMemberResponse()
  }
}
