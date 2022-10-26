import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import type { VerifyOptions } from 'jsonwebtoken'
import { decode, verify } from 'jsonwebtoken'
import { z } from 'zod'
import { loginWithRefreshToken } from '../utils/login'
import { getConfig } from '../utils/config'

const config = getConfig()

// this type will be extended in the future
const jwtUserPayload = z.object({
  username: z.string()
})

type User = z.output<typeof jwtUserPayload>

// TODO: decide on some sensible options
const jwtDefaultOptions: VerifyOptions = {

}

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
      const payload = verify(jwt, cert, { ...jwtDefaultOptions, complete: false })
      return z.object({ user: jwtUserPayload }).safeParse(payload).success
    } catch (error) {
      return false
    }
  }
}

type UseAuthOptions = {
  cookies: {
    accessTokenName: string,
    refreshTokenName: string
  }
}

const defaultUseAuthOptions: UseAuthOptions = {
  cookies: {
    accessTokenName: 'jwt-access-token',
    refreshTokenName: 'jwt-refresh-token'
  }
}

export const useAuth = (redirect: () => void, options = defaultUseAuthOptions) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const accessToken = Cookies.get(options.cookies.accessTokenName)
    const refreshToken = Cookies.get(options.cookies.refreshTokenName)

    const accessTokenValid = accessToken !== undefined && jwt.verify(accessToken)
    const refreshTokenValid = refreshToken !== undefined && jwt.verify(refreshToken)

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
        setUser(jwt.parse(accessToken))
      }
      return
    }

    // access token expired, use refresh token to acquire new access token and set user data afterwards
    if (refreshTokenValid) {
      loginWithRefreshToken(refreshToken)
        .then(({ accessToken, refreshToken }) => {
          if (refreshToken !== null) {
            Cookies.set('jwt-refresh-token', refreshToken)
          }
          Cookies.set('jwt-access-token', accessToken)
          setUser(jwt.parse(accessToken))
        })
      return
    }
    redirect()
  }, [redirect, options, user, setUser])

  const logout = (redirect: () => void) => {
    Cookies.remove(options.cookies.accessTokenName)
    Cookies.remove(options.cookies.refreshTokenName)
    redirect()
  }

  return { user, logout, accessToken: Cookies.get(options.cookies.accessTokenName) }
}
