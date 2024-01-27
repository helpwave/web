import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '@helpwave/common/hooks/useLocalStorage'
import type { OrganizationDTO } from '@/mutations/organization_mutations'
import { useOrganizationsForUserQuery } from '@/mutations/organization_mutations'
import { OrganizationSwitchModal } from '@/components/OrganizationSwitchModal'

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

export const ProvideOrganization = ({ children }: PropsWithChildren) => {
  const { data: organizations } = useOrganizationsForUserQuery()
  const [organization, setOrganization] = useState<OrganizationDTO>()
  const [isOrganizationSwitchModalOpen, setOrganizationSwitchModalOpen] = useState(false)
  const [storedOrganization, setStoredOrganization] = useLocalStorage<OrganizationDTO | undefined>(LOCALSTORAGE_ORGANIZATION_KEY, undefined)

  useEffect(() => {
    console.log(storedOrganization)
    if (storedOrganization) {
      setOrganization(storedOrganization)
    }
  }, [])

  useEffect(() => {
    setOrganizationSwitchModalOpen(!organization)
    if (organization) {
      setStoredOrganization(organization)
    }
  }, [organization])

  const setOrganizationId = (organizationId: string) => setOrganization(organizations?.find((organization) => organization.id === organizationId))

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization, setOrganizationId }}>
      <OrganizationSwitchModal
        id="organization-switch-modal"
        isOpen={isOrganizationSwitchModalOpen}
        organizations={organizations}
        onDone={setOrganization}
      />
      { organization && children }
    </OrganizationContext.Provider>
  )
}
