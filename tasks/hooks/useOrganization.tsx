import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '@helpwave/common/hooks/useLocalStorage'
import type { OrganizationDTO } from '@/mutations/organization_mutations'
import { OrganizationSwitchModal } from '@/components/OrganizationSwitchModal'

export type OrganizationContextValue = {
  organization: OrganizationDTO | undefined,
  setOrganization: Dispatch<SetStateAction<OrganizationDTO | undefined>>
}

export const OrganizationContext = createContext<OrganizationContextValue>({
  organization: undefined,
  setOrganization: () => {},
})

export const useOrganization = () => useContext(OrganizationContext)

export const ProvideOrganization = ({ children }: PropsWithChildren) => {
  const [organization, setOrganization] = useState<OrganizationDTO>()
  const [isOrganizationSwitchModalOpen, setOrganizationSwitchModalOpen] = useState(false)
  const [storedOrganization, setStoredOrganization] = useLocalStorage<OrganizationDTO | undefined>('organization', undefined)

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

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      <OrganizationSwitchModal
        id="organization-switch-modal"
        isOpen={isOrganizationSwitchModalOpen}
        onDone={setOrganization}
      />
      { organization && children }
    </OrganizationContext.Provider>
  )
}
