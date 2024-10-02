import useLocalStorage from '@helpwave/common/hooks/useLocalStorage'
import type { OrganizationDTO } from '../types/users/organizations'
import { LOCALSTORAGE_ORGANIZATION_KEY } from './useAuth'

export const useCurrentOrganization = () => {
  const [currentOrganization] = useLocalStorage<OrganizationDTO | undefined>(LOCALSTORAGE_ORGANIZATION_KEY, undefined)
  return currentOrganization
}
