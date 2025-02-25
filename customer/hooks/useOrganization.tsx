'use client' // Ensures this runs only on the client-side

import type { PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { Customer } from '@/api/dataclasses/customer'
import { CustomerAPI } from '@/api/services/customer'
import { useAuth } from '@/hooks/useAuth'

type Organization = Customer

type OrganizationContextType = {
  hasOrganization: boolean,
  organization?: Organization,
  reload: () => void,
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const OrganizationProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth()
  const [organization, setOrganization] = useState<Organization>()
  const [redirect, setRedirect] = useState<string>('/')
  const router = useRouter()

  const checkOrganization = useCallback(async () => {
    const organization: Organization | undefined = await CustomerAPI.getMyself()
    if (organization) {
      // TODO change to parsing later
      setOrganization(organization)
      router.push(redirect).catch(console.error) // TODO use a redirect here
    } else {
      setOrganization(undefined)
      setRedirect(router.pathname)
      router.push('/create-organization').catch(console.error)
    }
  }, [redirect, router])

  useEffect(() => {
    if (!isAuthenticated) {
      // Cannot do the check when not logged in
      return
    }
    checkOrganization().catch(console.error)
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  const reload = useCallback(async () => {await  checkOrganization()}, [checkOrganization])

  return (
    <OrganizationContext.Provider value={{ hasOrganization: !!organization, organization, reload }}>
      {children}
    </OrganizationContext.Provider>
  )
}

// Custom hook for using OrganizationContext
export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
