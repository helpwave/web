/**
 * Defines the possible roles a user can have.
 */
export type UserRole = 'admin' | 'user';

/**
 * Represents a user seat in the system.
 */
export type UserSeat = {
  /**
   * Unique identifier for the customer associated with this user.
   */
  customerUUID: string,

  /**
   * Email address of the user.
   */
  email: string,

  /**
   * First name of the user.
   */
  firstName: string,

  /**
   * Last name of the user.
   */
  lastName: string,

  /**
   * Role assigned to the user, which determines their level of access.
   */
  role: UserRole,

  /**
   * Indicates whether the user account is enabled or disabled.
   */
  enabled: boolean,
};
