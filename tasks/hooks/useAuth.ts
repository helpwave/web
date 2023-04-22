import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import type { VerifyOptions } from 'jsonwebtoken'
import { decode, verify } from 'jsonwebtoken'
import { z } from 'zod'
import { loginWithRefreshToken } from '../utils/login'
import { getConfig } from '../utils/config'

const config = getConfig()

const organizationSchema = z.object({
  id: z.string().uuid(),
  shortName: z.string(),
  longName: z.string(),
  avatarUrl: z.string().url().nullable(), // TODO: make this required once we have a default avatar, should enforce https (or localhost) as well
  contactEmail: z.string().email().nullable(), // TODO: in the rfc this is currently named "contact"
})

const userSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  // TODO: in the distant future we might want to use s3 or something, this could require a change here possibly?;
  // TODO: should enfore https (or localhost?)
  avatarUrl: z.string().url(),
  role: z.enum(['admin', 'user']),
  organizations: z.array(
    organizationSchema.merge(z.object({ role: z.string() }))
  ),
})

// TODO: we may or may not have some differentiating features between the actual user data and what is stored in the jwt
// TODO: for the time being we will just add things here regardless but we may have to revisit this in the future
const jwtUserPayload = userSchema

export type User = z.output<typeof userSchema>;

// TODO: decide on some sensible options
const jwtDefaultOptions: VerifyOptions = {}

// TODO: this will have to be set somehow; maybe fetch this at startup or bake it in at build time
// TODO: could also use something like .well-known / jwks
const cert = ''

const jwt = {
  parse: (jwt: string): User => {
    const decoded = decode(jwt, jwtDefaultOptions)
    const parsed = z.object({ user: jwtUserPayload }).safeParse(decoded)
    if (decoded === null || !parsed.success) {
      throw new Error('Failed to decode token')
    }
    return parsed.data.user
  },
  verify: (jwt: string): boolean => {
    if (config.mock) {
      return z.object({ user: jwtUserPayload }).safeParse(decode(jwt)).success
    }
    try {
      const payload = verify(jwt, cert, {
        ...jwtDefaultOptions,
        complete: false,
      })
      return z.object({ user: jwtUserPayload }).safeParse(payload).success
    } catch (error) {
      return false
    }
  },
}

type UseAuthOptions = {
  cookies: {
    accessTokenName: string,
    refreshTokenName: string
  }
};

const defaultUseAuthOptions: UseAuthOptions = {
  cookies: {
    accessTokenName: 'jwt-access-token',
    refreshTokenName: 'jwt-refresh-token',
  },
}

export const useAuth = (
  redirect: () => void,
  options = defaultUseAuthOptions
) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJhY2Nlc3MtdG9rZW4iLCJpc3MiOiJkZXYuYXV0aC5oZWxwd2F2ZS5kZSIsImF1ZCI6ImRldi53ZWIuaGVscHdhdmUuZGUiLCJzdWIiOjEyMzQ1Njc4OSwiZXhwIjoxMjA5NjAwLCJpYXQiOjE2ODIxNjQwMDUuOTk5LCJ1c2VyIjp7ImlkIjoiZDc3MWJlNjYtMjI1Mi00NmJkLTk2ODEtODEzYmFhYzVhZTNmIiwiZnVsbE5hbWUiOiJNYXggTXVzdGVybWFubiIsImRpc3BsYXlOYW1lIjoiTWF4IiwiZW1haWwiOiJ1c2VyQGRldi5oZWxwd2F2ZS5kZSIsImF2YXRhclVybCI6Imh0dHBzOi8vc291cmNlLmJvcmluZ2F2YXRhcnMuY29tLyIsInJvbGUiOiJhZG1pbiIsIm9yZ2FuaXphdGlvbnMiOlt7ImlkIjoiZDQ1ZGRmYzAtMWZjMy00ZmE3LTk1ZTktZWRkN2QxMzQxMDNhIiwic2hvcnROYW1lIjoiQUJDIiwibG9uZ05hbWUiOiJIb3NwaXRhbCBBQkMiLCJhdmF0YXJVcmwiOm51bGwsImNvbnRhY3RFbWFpbCI6ImluZm9AaG9zcGl0YWwtYWJjLmV4YW1wbGUiLCJyb2xlIjoiIn1dfX0.invalid'
    Cookies.set(options.cookies.accessTokenName, mockToken)
    Cookies.set(options.cookies.refreshTokenName, 'refreshing')

    const accessToken = Cookies.get(options.cookies.accessTokenName)
    const refreshToken = Cookies.get(options.cookies.refreshTokenName)

    const accessTokenValid =
      (accessToken !== undefined && jwt.verify(accessToken)) || true // TODO apply ory auth
    const refreshTokenValid =
      (refreshToken !== undefined && jwt.verify(refreshToken)) || true // TODO apply ory auth

    // remove tokens if invalid
    if (accessToken !== undefined && !accessTokenValid) {
      Cookies.remove(options.cookies.accessTokenName)
    }

    if (refreshToken !== undefined && !refreshTokenValid) {
      Cookies.remove(options.cookies.refreshTokenName)
    }

    // success, set user data extracted from jwt (if user isn't already set)
    if (accessTokenValid) {
      if (user === null) {
        if (accessToken) {
          setUser(jwt.parse(accessToken))
        }
      }
      return
    }

    // access token expired, use refresh token to acquire new access token and set user data afterwards
    if (refreshTokenValid) {
      if (refreshToken) {
        loginWithRefreshToken(refreshToken).then(
          ({ accessToken, refreshToken }) => {
            if (refreshToken !== null) {
              Cookies.set('jwt-refresh-token', refreshToken)
            }
            Cookies.set('jwt-access-token', accessToken)
            setUser(jwt.parse(accessToken))
          }
        )
      }
      return
    }
    redirect()
  }, [redirect, options, user, setUser])

  const logout = (redirect: () => void) => {
    Cookies.remove(options.cookies.accessTokenName)
    Cookies.remove(options.cookies.refreshTokenName)
    redirect()
  }

  return {
    user,
    logout,
    accessToken: Cookies.get(options.cookies.accessTokenName),
  }
}
