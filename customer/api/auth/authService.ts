'use client'

import { CLIENT_ID, OIDC_PROVIDER, POST_LOGOUT_REDIRECT_URI, REDIRECT_URI } from '@/api/auth/config'
import type { User } from 'oidc-client-ts'
import { UserManager } from 'oidc-client-ts'

const userManager = new UserManager({
  authority: OIDC_PROVIDER,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  // userStore: userStore, // TODO Consider persisting user data across sessions
})

export const signUp = () => {
  return userManager.signinRedirect()
}

export const login = (redirectURI?: string) => {
  return userManager.signinRedirect({ redirect_uri: redirectURI })
}

export const handleCallback = async () => {
  return await userManager.signinRedirectCallback()
}

export const logout = () => {
  return userManager.signoutRedirect()
}

export const getUser = async (): Promise<User | null> => {
  return await userManager.getUser()
}

export const renewToken = async () => {
  return await userManager.signinSilent()
}

export const restoreSession = async (): Promise<User | undefined> => {
  if (typeof window === 'undefined') return // Prevent SSR access
  const user = await userManager.getUser()
  if (!user) return

  // If access token is expired, refresh it
  if (user.expired) {
    try {
      console.log('Access token expired, refreshing...')
      const refreshedUser = await renewToken()
      return refreshedUser ?? undefined
    } catch (error) {
      console.error('Silent token renewal failed', error)
      return
    }
  }

  return user
}

userManager.events.addAccessTokenExpiring(async () => {
  console.log('Token expiring, refreshing...')
  await renewToken()
})
