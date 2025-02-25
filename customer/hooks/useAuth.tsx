'use client' // Ensures this runs only on the client-side

import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

type Identity = {
  token: string,
  name: string,
}

type AuthContextType = {
  isAuthenticated: boolean,
  identity?: Identity,
  login: (email: string, password: string) => void,
  logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const cookieName = 'authToken'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [identity, setIdentity] = useState<Identity>()
  const [redirect, setRedirect] = useState<string>('/')
  const router = useRouter()

  const checkAndHandleCookie = () => {
    const token = Cookies.get(cookieName)
    const newAuthState = !!token
    if (newAuthState) {
      // TODO change to parsing later
      const identity: Identity = { token: 'test-token', name: 'Max Mustermann' }
      setIdentity(identity)
      router.push(redirect).catch(console.error) // TODO use a redirect here
    } else {
      setIdentity(undefined)
      setRedirect(router.pathname)
      router.push('/login').catch(console.error)
    }
  }

  // Check authentication state on first load
  useEffect(() => {
    checkAndHandleCookie()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = (email: string, _: string) => {
    // TODO do real login
    Cookies.set(cookieName, email, { expires: 1 })
    checkAndHandleCookie()
  }

  const logout = () => {
    Cookies.remove(cookieName)
    checkAndHandleCookie()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!identity, identity, login, logout }}>
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
