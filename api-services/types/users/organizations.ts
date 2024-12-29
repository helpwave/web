import type { OrganizationMember, OrganizationMemberMinimalDTO } from './organization_member'

export type OrganizationMinimalDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  isPersonal: boolean,
  avatarURL: string,
}

export type OrganizationDTO = OrganizationMinimalDTO & {
  members: OrganizationMember[],
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
  members: OrganizationMemberMinimalDTO[],
}

export type OrganizationDisplayableDTO = {
  id: string,
  longName: string,
  avatarURL: string,
}
