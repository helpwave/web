'use client' // Ensures this runs only on the client-side

import type { ComponentType, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import { LoadingAnimation } from '@helpwave/hightide/components/LoadingAnimation'
import { LoginPage } from '@/components/pages/login'
import { login, logout, onTokenExpiringCallback, removeUser, renewToken, restoreSession } from '@/api/auth/authService'
import type { User } from 'oidc-client-ts'
import { REDIRECT_URI } from '@/api/config'

type AuthContextType = {
  identity: User,
  logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthState = {
  identity?: User,
  isLoading: boolean,
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [{ isLoading, identity }, setAuthState] = useState<AuthState>({ isLoading: true })

  useEffect(() => {
    restoreSession().then(identity => {
      if(identity) {
        setAuthState({
          identity,
          isLoading: false,
        })
        onTokenExpiringCallback(async () => {
          console.log('Token expiring, refreshing...')
          const identity = await renewToken()
          setAuthState({
            identity: identity ?? undefined,
            isLoading: false,
          })
        })
      } else {
        login(REDIRECT_URI + `?redirect_uri=${encodeURIComponent(window.location.href)}`).catch(console.error)
      }
    }).catch(async () => {
      await removeUser()
      await login(REDIRECT_URI + `?redirect_uri=${encodeURIComponent(window.location.href)}`)
    })
  }, [])

  if (!identity && isLoading) {
    return (
      <div className="col items-center justify-center w-screen h-screen">
        <LoadingAnimation loadingText="Logging in..."/>
      </div>
    )
  }

  if (!identity) {
    return (
      <LoginPage login={async () => {
        await login(REDIRECT_URI + `?redirect_uri=${encodeURIComponent(window.location.href)}`)
        return true
      }}/>
    )
  }

  return (
    <AuthContext.Provider value={{ identity, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const withAuth = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <AuthProvider>
      <Component {...props} />
    </AuthProvider>
  )
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}


// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  const authHeader = {
    Authorization: `Bearer ${context.identity.access_token}`,
  }
  return { ...context, authHeader }
}
