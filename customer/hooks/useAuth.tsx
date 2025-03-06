'use client' // Ensures this runs only on the client-side

import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { LoginPage } from '@/components/pages/login'
import { handleCallback, login, logout, restoreSession } from '@/api/auth/authService'
import type { User } from 'oidc-client-ts'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()

  useEffect(() => {
    restoreSession().then(identity => {
      setAuthState({
        identity,
        isLoading: false,
      })
    })
  }, [])

  useEffect(() => {
    const checkAuthCallback = async () => {
      // Check if the URL contains OIDC callback params
      if (searchParams.get('code') &&  searchParams.get('state')) {
        console.log('Processing OIDC callback...')
        try {
          const user = await handleCallback()
          // Remove the 'state' and 'code' parameters from url
          const currentUrl = new URL(window.location.href)
          const searchParams = currentUrl.searchParams
          searchParams.delete('state')
          searchParams.delete('code')
          searchParams.delete('session_state')
          searchParams.delete('iss')
          window.history.replaceState({}, '', currentUrl.toString())
          setAuthState({
            identity: user,
            isLoading: false,
          })
        } catch (error) {
          console.error('OIDC callback error:', error)
        }
      }
    }

    checkAuthCallback().catch(console.error)
  }, [searchParams])

  if (!identity && isLoading) {
    return (
      <div className={tw('flex flex-col items-center justify-center w-screen h-screen')}>
        <LoadingAnimation loadingText="Logging in..."/>
      </div>
    )
  }

  if (!identity) {
    return (
      <LoginPage login={async () => {
        await login()
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


// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  const authHeader = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${context.identity.access_token}`,
  }
  return { ...context, authHeader }
}
