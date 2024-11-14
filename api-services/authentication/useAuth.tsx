import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import keycloakInstance, { KeycloakService } from '../util/keycloak'
import { createPersonalOrganization } from '../mutations/users/organization_mutations'
import { getAPIServiceConfig } from '../config/config'

const IdTokenClaimsSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string(),
  preferred_username: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string()
  }).optional()
})

export const fakeToken = IdTokenClaimsSchema.default({
  sub: '18159713-5d4e-4ad5-94ad-fbb6bb147984',
  email: 'max.mustermann@helpwave.de',
  email_verified: true,
  name: 'Max Mustermann',
  preferred_username: 'max.mustermann',
  given_name: 'Max',
  family_name: 'Mustermann',
  organization: {
    id: '3b25c6f5-4705-4074-9fc6-a50c28eba406',
    name: 'helpwave fake'
  }
})

const config = getAPIServiceConfig()

const UserFromIdTokenClaims = IdTokenClaimsSchema.transform((obj) => ({
  id: obj.sub,
  email: obj.email,
  name: obj.name,
  nickname: obj.preferred_username,
  avatarUrl: `https://source.boringavatars.com/marble/80/${obj.sub}`,
  organization: obj.organization
}))

export type User = z.output<typeof UserFromIdTokenClaims>

const parseJwtPayload = (token: string) => {
  // can safely cast to string here, we know JWTs have 3 parts
  const payloadBase64 = token.split('.')[1] as string
  const decodedPayload = Buffer.from(payloadBase64, 'base64').toString()
  return JSON.parse(decodedPayload)
}

const tokenToUser = (token: string): User | null => {
  let decoded: string
  if (config.fakeTokenEnable) {
    decoded = JSON.parse(Buffer.from(token, 'base64').toString())
  } else {
    decoded = parseJwtPayload(token)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Object.keys(decoded?.organization).length === 0) delete decoded.organization

  const parsed = UserFromIdTokenClaims.safeParse(decoded)
  return parsed.success ? parsed.data : null
}

type AuthContextValue = {
  user?: User,
  setUser?: Dispatch<SetStateAction<User|undefined>>,
  token?: string,
  organization?: {
    id: string,
    name: string
  },
  organizations: string[],
  signOut: () => void,
  redirectUserToOrganizationSelection: () => void
}

const defaultAuthContextValue: AuthContextValue = {
  user: undefined,
  token: undefined,
  organization: undefined,
  organizations: [],
  signOut: () => {},
  redirectUserToOrganizationSelection: () => {}
}

const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue)

export const useAuth = (): AuthContextValue => {
  const authContext = useContext(AuthContext)

  useEffect(() => {
    if (config.fakeTokenEnable) return
    keycloakInstance?.updateToken(30)
      .then(() => {
        if (!authContext?.setUser || !keycloakInstance?.token) return
        const user = tokenToUser(keycloakInstance.token)
        if (!user) {
          console.warn('after creating organization, no token after updateToken')
          return
        }
        authContext.setUser(user)
      })
  }, [])

  return authContext
}

export const ProvideAuth = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>()
  const didInit = useRef(false)

  useEffect(() => {
    if (config.fakeTokenEnable) {
      const user = tokenToUser(config.fakeToken)
      if (!user) throw new Error('Invalid fake token')
      didInit.current = true
      setUser(user)
      setToken(config.fakeToken)
      return
    }

    if (didInit.current || !keycloakInstance) {
      return
    }
    didInit.current = true

    KeycloakService.initKeycloak(keycloakInstance).then(() => {
      if (!keycloakInstance?.token) {
        console.warn('after init keycloak, no token')
        return
      }

      const user = tokenToUser(keycloakInstance.token)
      if (!user) {
        console.warn('after init keycloak, cannot get user from token')
        return
      }

      if (!user?.organization?.id) {
        console.info('after init keycloak, no organization found, creating personal')
        createPersonalOrganization()
          .then(() => {
            keycloakInstance?.updateToken(-1)
              .then(() => {
                if (!keycloakInstance?.token) {
                  console.warn('after creating organization, no token after updateToken')
                  return
                }

                const user = tokenToUser(keycloakInstance.token)
                if (!user) {
                  console.warn('after creating organization, cannot get user from token')
                  return
                }

                setUser(user)
                setToken(token)
              })
          })
          .catch(console.error)
      } else {
        setUser(user)
        setToken(keycloakInstance.token)
      }
    })
  }, [token])

  const signOut = () => {
    if (config.fakeTokenEnable || !keycloakInstance) return
    keycloakInstance.logout({ redirectUri: 'https://helpwave.de' })
  }

  const redirectUserToOrganizationSelection = () => {
    if (config.fakeTokenEnable || !keycloakInstance) return
    // TODO: Change org without relogin
    keycloakInstance.logout({ redirectUri: window.location.href })
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      organization: user?.organization,
      organizations: user?.organization ? [user.organization.id] : [],
      signOut,
      redirectUserToOrganizationSelection,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
