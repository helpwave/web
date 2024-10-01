import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect } from 'react'
import useLocalStorage from '@helpwave/common/hooks/useLocalStorage'
import { useQueryClient } from '@tanstack/react-query'
import type { OrganizationDTO } from '@helpwave/api-services/types/users/organizations'
import { useOrganizationsForUserQuery } from '@helpwave/api-services/mutations/users/organization_mutations'
import { useAuth } from '@helpwave/api-services/authentication/useAuth'
import { OrganizationSwitchModal } from '@/components/modals/OrganizationSwitchModal'

export const LOCALSTORAGE_ORGANIZATION_KEY = 'organization'

export type OrganizationContextValue = {
  organization: OrganizationDTO | undefined,
  setOrganization: Dispatch<SetStateAction<OrganizationDTO | undefined>>,
  setOrganizationId: (organizationId: string) => void
}

export const OrganizationContext = createContext<OrganizationContextValue>({
  organization: undefined,
  setOrganization: () => {},
  setOrganizationId: () => {},
})

export const useOrganization = () => useContext(OrganizationContext)

/**
 * TODO: Not a big fan of this useState() passing
 * but I need to use the current organization AND applying ProvideOrganization in the same component
 * See PageWithHeader.tsx
 * @MaxSchaefer
 */
type ProvideOrganizationProps = {
  isOrganizationSwitchModalOpen: boolean,
  setOrganizationSwitchModalOpen: Dispatch<SetStateAction<boolean>>,
  organization: OrganizationDTO | undefined,
  setOrganization: Dispatch<SetStateAction<OrganizationDTO | undefined>>
}

export const ProvideOrganization = ({
  children,
  organization,
  setOrganization,
  isOrganizationSwitchModalOpen,
  setOrganizationSwitchModalOpen
}: PropsWithChildren<ProvideOrganizationProps>) => {
  useAuth() // Calling useAuth() to prepare the context for later operations

  const queryClient = useQueryClient()
  const { data: organizations } = useOrganizationsForUserQuery()
  const [storedOrganization, setStoredOrganization] = useLocalStorage<OrganizationDTO | undefined>(LOCALSTORAGE_ORGANIZATION_KEY, undefined)
  // TOOD: See #26
  // const [organization, setOrganization] = useState<OrganizationDTO>()
  // const [isOrganizationSwitchModalOpen, setOrganizationSwitchModalOpen] = useState(false)

  useEffect(() => {
    if (storedOrganization) {
      setOrganization(storedOrganization)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOrganizationSwitchModalOpen(!organization)
    if (organization) {
      setStoredOrganization(organization)
    }
  }, [organization]) // eslint-disable-line react-hooks/exhaustive-deps

  const setOrganizationId = (organizationId: string) => {
    const organization = organizations?.find((organization) => organization.id === organizationId)
    if (organization) {
      setOrganization(organization)
    }
  }

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization, setOrganizationId }}>
      <OrganizationSwitchModal
        id="organization-switch-modal"
        isOpen={isOrganizationSwitchModalOpen}
        currentOrganization={storedOrganization?.id}
        organizations={organizations}
        onDone={(organization) => {
          setOrganization(organization)
          queryClient.resetQueries()
        }}
      />
      { children }
    </OrganizationContext.Provider>
  )
}
