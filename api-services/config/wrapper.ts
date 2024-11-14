import { getAPIServiceConfig } from './config'

export const APIServiceUrls = {
  tasks: `${getAPIServiceConfig().apiUrl}/tasks-svc`,
  users: `${getAPIServiceConfig().apiUrl}/user-svc`,
  property: `${getAPIServiceConfig().apiUrl}/property-svc`,
  updates: `${getAPIServiceConfig().apiUrl}/updates-svc`
}
