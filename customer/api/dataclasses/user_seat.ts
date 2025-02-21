export type UserRole = 'admin' | 'user'

export type UserSeat = {
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  enabled: boolean,
}
