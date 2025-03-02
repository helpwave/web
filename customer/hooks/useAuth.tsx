'use client' // Ensures this runs only on the client-side

import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import type { LoginData } from '@/components/pages/login'
import { LoginPage } from '@/components/pages/login'

type Identity = {
  token: string,
  name: string,
}

type AuthContextType = {
  identity: Identity,
  logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthState = {
  identity?: Identity,
  isLoading: boolean,
}

const cookieName = 'authToken'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [{ isLoading, identity }, setAuthState] = useState<AuthState>({ isLoading: true })

  const checkIdentity = () => {
    setAuthState({ isLoading: true })
    const token = Cookies.get(cookieName)
    const newAuthState = !!token
    if (newAuthState) {
      const identity: Identity = { token: 'test-token', name: 'Max Mustermann' }
      setAuthState({ identity, isLoading: false })
    } else {
      setAuthState({ isLoading: false })
    }
  }

  // Check authentication state on first load
  useEffect(() => {
    checkIdentity()
  }, [])

  const login = async (_: LoginData) => {
    // TODO do real login
    Cookies.set(cookieName, 'testdata', { expires: 1 })
    checkIdentity()
    return true
  }

  const logout = () => {
    Cookies.remove(cookieName)
    checkIdentity()
  }

  if (!identity && isLoading) {
    return (
      <div className={tw('flex flex-col items-center justify-center w-screen h-screen')}>
        <LoadingAnimation loadingText="Logging in..."/>
      </div>
    )
  }

  if (!identity) {
    return (<LoginPage login={login} />)
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
  return context
}
