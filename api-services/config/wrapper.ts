import { getAPIServiceConfig } from './config'

export const APIServiceUrls = {
  tasks: `${getAPIServiceConfig().apiUrl}/task-svc`,
  users: `${getAPIServiceConfig().apiUrl}/user-svc`,
  property: `${getAPIServiceConfig().apiUrl}/property-svc`
}
