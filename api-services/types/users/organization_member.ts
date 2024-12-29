export type OrganizationMemberMinimalDTO = {
  id: string,
}

export type OrganizationMember = OrganizationMemberMinimalDTO & {
  email: string,
  name: string,
  avatarURL: string,
}
