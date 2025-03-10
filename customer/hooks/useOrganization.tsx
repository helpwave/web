import type { ComponentType, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { createContext, useContext, useState } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import { CustomerAPI } from '@/api/services/customer'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { CreateOrganizationPage } from '@/components/pages/create-organization'
import { useCustomerCreateMutation } from '@/api/mutations/customer_mutations'

type Organization = Customer

type OrganizationContextType = {
  hasOrganization: boolean,
  organization?: Organization,
  reload: () => void,
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

type OrganizationProviderState = {
  isLoading: boolean,
  organization?: Organization,
}

export const OrganizationProvider = ({ children }: PropsWithChildren) => {
  const [{
    organization,
    isLoading
  }, setOrganizationProviderState] = useState<OrganizationProviderState>({ isLoading: true })

  const createOrganizationMutation = useCustomerCreateMutation()

  const checkOrganization = useCallback(async () => {
    setOrganizationProviderState({ isLoading: true })
    const organization: Organization | undefined = await CustomerAPI.getMyself()
    setOrganizationProviderState({ organization, isLoading: false })
  }, [])

  useEffect(() => {
    checkOrganization()
  }, [])

  const reload = useCallback(async () => {
    await checkOrganization()
  }, [checkOrganization])

  if (!organization && isLoading) {
    return (
      <div className={tw('flex flex-col items-center justify-center w-screen h-screen')}>
        <LoadingAnimation loadingText="Loading organization..."/>
      </div>
    )
  }

  if (!organization) {
    return (
      <CreateOrganizationPage  createOrganization={async (data) => {
        await createOrganizationMutation.mutate(data)
        await checkOrganization()
        return true
      }}
      />
    )
  }

  return (
    <OrganizationContext.Provider value={{ hasOrganization: !!organization, organization, reload }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export const withOrganization = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <OrganizationProvider>
      <Component {...props} />
    </OrganizationProvider>
  )
  WrappedComponent.displayName = `withOrganization(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

// Custom hook for using OrganizationContext
export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
