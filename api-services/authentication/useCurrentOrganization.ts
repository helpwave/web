import { LocalStorageService } from '@helpwave/common/util/storage'
import type { OrganizationDTO } from '../types/users/organizations'
import { LOCALSTORAGE_ORGANIZATION_KEY } from './useAuth'

export const useCurrentOrganization = () => {
  const localStorageService = new LocalStorageService()
  return localStorageService.get<OrganizationDTO>(LOCALSTORAGE_ORGANIZATION_KEY)
}
