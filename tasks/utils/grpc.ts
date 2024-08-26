import { WardServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_grpc_web_pb'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/patient_svc_grpc_web_pb'
import Cookies from 'js-cookie'
import {
  TaskTemplateServicePromiseClient
} from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_grpc_web_pb'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_grpc_web_pb'
import {
  OrganizationServicePromiseClient
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_grpc_web_pb'
import { UserServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_grpc_web_pb'
import { PropertyServicePromiseClient } from '@helpwave/proto-ts/services/property_svc/v1/property_svc_grpc_web_pb'
import { LocalStorageService } from '@helpwave/common/util/storage'
import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import { getConfig } from './config'
import { COOKIE_ID_TOKEN_KEY } from '@/hooks/useAuth'
import { LOCALSTORAGE_ORGANIZATION_KEY } from '@/hooks/useOrganization'
import type { OrganizationDTO } from '@/mutations/organization_mutations'
import { PropertyOfflineServicePromiseClient } from '@/mutations/offline/services/property/property_service'
import { PropertyValueOfflineServicePromiseClient } from '@/mutations/offline/services/property/property_value_service'
import { WardOfflineServicePromiseClient } from '@/mutations/offline/services/ward_service'
import { RoomOfflineServicePromiseClient } from '@/mutations/offline/services/room_service'
import { BedOfflineServicePromiseClient } from '@/mutations/offline/services/bed_service'
import { PatientOfflineServicePromiseClient } from '@/mutations/offline/services/patient_service'
import { TaskOfflineServicePromiseClient } from '@/mutations/offline/services/task_service'
import { TaskTemplateOfflineServicePromiseClient } from '@/mutations/offline/services/task_template_service'

const taskSvcBaseUrl = `${getConfig().apiUrl}/task-svc`
const userSvcBaseUrl = `${getConfig().apiUrl}/user-svc`
const propertySvcBaseUrl = `${getConfig().apiUrl}/property-svc`

// TODO make this configurable
export const isOfflineMode = true

// TODO: Implement something like a service registry
export const wardService = isOfflineMode
  ? new WardOfflineServicePromiseClient(taskSvcBaseUrl)
  : new WardServicePromiseClient(taskSvcBaseUrl)
export const roomService = isOfflineMode
  ? new RoomOfflineServicePromiseClient(taskSvcBaseUrl)
  : new RoomServicePromiseClient(taskSvcBaseUrl)
export const bedService = isOfflineMode
  ? new BedOfflineServicePromiseClient(taskSvcBaseUrl)
  : new BedServicePromiseClient(taskSvcBaseUrl)
export const patientService = isOfflineMode
  ? new PatientOfflineServicePromiseClient(taskSvcBaseUrl)
  : new PatientServicePromiseClient(taskSvcBaseUrl)
export const taskService = isOfflineMode
  ? new TaskOfflineServicePromiseClient(taskSvcBaseUrl)
  : new TaskServicePromiseClient(taskSvcBaseUrl)
export const taskTemplateService = isOfflineMode
  ? new TaskTemplateOfflineServicePromiseClient(taskSvcBaseUrl)
  : new TaskTemplateServicePromiseClient(taskSvcBaseUrl)
export const propertyService = isOfflineMode
  ? new PropertyOfflineServicePromiseClient(propertySvcBaseUrl)
  : new PropertyServicePromiseClient(propertySvcBaseUrl)

export const propertyValueService = isOfflineMode
  ? new PropertyValueOfflineServicePromiseClient(propertySvcBaseUrl)
  : new PropertyValueServicePromiseClient(propertySvcBaseUrl)
export const organizationService = new OrganizationServicePromiseClient(userSvcBaseUrl)
export const userService = new UserServicePromiseClient(userSvcBaseUrl)

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
