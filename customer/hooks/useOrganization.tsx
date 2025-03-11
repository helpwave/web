import type { ComponentType, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'
import type { Customer } from '@/api/dataclasses/customer'
import { tw } from '@twind/core'
import { LoadingAnimation } from '@helpwave/common/components/LoadingAnimation'
import { CreateOrganizationPage } from '@/components/pages/create-organization'
import { useCustomerMyselfQuery } from '@/api/mutations/customer_mutations'
import { CustomerAPI } from '@/api/services/customer'

type Organization = Customer

type OrganizationContextType = {
  hasOrganization: boolean,
  organization?: Organization,
  reload: () => void,
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const OrganizationProvider = ({ children }: PropsWithChildren) => {
  const { isLoading, isError, data: organization, refetch } = useCustomerMyselfQuery()

  if (!organization && isLoading) {
    return (
      <div className={tw('flex flex-col items-center justify-center w-screen h-screen')}>
        <LoadingAnimation loadingText="Loading organization..."/>
      </div>
    )
  }

  if(isError) {
    return (
      <div className={tw('flex flex-col items-center justify-center w-screen h-screen')}>
        <span className={tw('text-hw-negative-400')}>An Error occurred</span>
      </div>
    )
  }

  if (!organization) {
    return (
      <CreateOrganizationPage createOrganization={async (data) => {
        console.log(await CustomerAPI.create(data))

        //refetch().catch(console.error)
        return true
      }}
      />
    )
  }

  return (
    <OrganizationContext.Provider value={{ hasOrganization: !!organization, organization, reload: refetch }}>
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
