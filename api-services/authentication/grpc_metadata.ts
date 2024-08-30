import type { OrganizationDTO } from '../mutations/organization_mutations'

type AuthenticatedGrpcMetadata = {
  Authorization: string,
  'X-Organization': string
}

const defaultOrganization = `3b25c6f5-4705-4074-9fc6-a50c28eba406`
export const getAuthenticatedGrpcMetadata = (organizationID: string = defaultOrganization): AuthenticatedGrpcMetadata => {
  // TODO: Implement way better API for get the current id token and DONT hardcode the organization id
  const idToken = Cookies.get(COOKIE_ID_TOKEN_KEY)

  const localStorageService = new LocalStorageService()
  const organization = localStorageService.get<OrganizationDTO>(LOCALSTORAGE_ORGANIZATION_KEY)

  if (organization) {
    organizationID = organization.id
  } else {
    console.warn('Fallback to default organization')
  }

  return {
    'Authorization': `Bearer ${idToken}`,
    'X-Organization': organizationID
  }
}
