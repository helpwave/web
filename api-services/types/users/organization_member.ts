export type OrganizationMemberMinimalDTO = {
  userId: string,
}

export type OrganizationMember = OrganizationMemberMinimalDTO & {
  email: string,
  nickname: string,
  avatarURL?: string,
}
