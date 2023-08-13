import { useEffect, useState } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { getAuthorizationUrl } from '../utils/oauth'
import { useConfig } from './useConfig'

export const COOKIE_ID_TOKEN_KEY = 'id-token'
export const COOKIE_REFRESH_TOKEN_KEY = 'refresh-token'
export const LOCALSTORAGE_HREF_AFTER_AUTH_KEY = 'href-after-auth'

const IdTokenClaimsSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  nickname: z.string()
}).transform((obj) => ({
  id: obj.sub,
  email: obj.email,
  name: obj.name,
  nickname: obj.nickname,
  avatarUrl: `https://source.boringavatars.com/marble/80/${obj.sub}`
}))

export type User = z.output<typeof IdTokenClaimsSchema>

const parseJwtPayload = (token: string) => {
  const payloadBase64 = token.split('.')[1]
  const decodedPayload = Buffer.from(payloadBase64, 'base64').toString()
  return JSON.parse(decodedPayload)
}

const parseFakeTokenPayload = (token: string) => JSON.parse(Buffer.from(token, 'base64').toString())

const tokenToUser = (token: string, parseTokenFnc: (token: string) => string): User | null => {
  const decoded = parseTokenFnc(token)
  const parsed = IdTokenClaimsSchema.safeParse(decoded)
  return parsed.success ? parsed.data : null
}

const isJwtExpired = (token: string) => {
  const payloadBase64 = token.split('.')[1]
  const decodedPayload = Buffer.from(payloadBase64, 'base64').toString()
  const parsedPayload = JSON.parse(decodedPayload)
  const exp = parsedPayload.exp
  return (Date.now() >= exp * 1000)
}

/**
 * The useAuth hook resolves the current user by handling the auth process.
 * In combination with '/auth/callback', this hook handles all
 * the redirections necessary to resolve the user.
 * The flow gets started when rendering the hook.
 *
 * TODO: Refresh tokens
 * TODO: Adopt more dynamic claims (name, nickname)
 */
export const useAuth = () => {
  const [user, setUser] = useState<User>()
  const [idToken, setIdToken] = useState<string>()
  const { config } = useConfig()

  const parseTokenFnc = config.fakeTokenEnable ? parseFakeTokenPayload : parseJwtPayload

  const signOut = () => {
    Cookies.remove(COOKIE_ID_TOKEN_KEY)
    Cookies.remove(COOKIE_REFRESH_TOKEN_KEY)
    window.location.reload()
  }

  useEffect(() => {
    try {
      const idToken = Cookies.get(COOKIE_ID_TOKEN_KEY)

      const idTokenValid = idToken !== undefined && (
        config.fakeTokenEnable
          ? tokenToUser(idToken, parseTokenFnc) !== null
          : !isJwtExpired(idToken)
      )

      if (!idTokenValid) Cookies.remove(COOKIE_ID_TOKEN_KEY)

      if (idTokenValid) {
        const user = tokenToUser(idToken, parseTokenFnc)
        if (!user) throw new Error('Cannot parse idToken to user')
        setUser(user)
        setIdToken(idToken)
        return
      }
    } catch (_) {
      Cookies.remove(COOKIE_ID_TOKEN_KEY)
    }

    // Both tokens are invalid. User needs to sign in again.
    getAuthorizationUrl(config)
      .then((url) => {
        // Store current href into localStorage. Will be used by /auth/callback.
        window.localStorage.setItem(LOCALSTORAGE_HREF_AFTER_AUTH_KEY, window.location.href)
        window.location.assign(url)
      })
  }, [])

  return { user, signOut, token: idToken, organization: '' }
}
