import { WardServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/ward_svc_grpc_web_pb'
import { RoomServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/room_svc_grpc_web_pb'
import { BedServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/bed_svc_grpc_web_pb'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/patient_svc_grpc_web_pb'
import {
  TaskTemplateServicePromiseClient
} from '@helpwave/proto-ts/services/task_svc/v1/task_template_svc_grpc_web_pb'
import { TaskServicePromiseClient } from '@helpwave/proto-ts/services/task_svc/v1/task_svc_grpc_web_pb'
import {
  OrganizationServicePromiseClient
} from '@helpwave/proto-ts/services/user_svc/v1/organization_svc_grpc_web_pb'
import { UserServicePromiseClient } from '@helpwave/proto-ts/services/user_svc/v1/user_svc_grpc_web_pb'
import { PropertyServicePromiseClient } from '@helpwave/proto-ts/services/property_svc/v1/property_svc_grpc_web_pb'
import {
  PropertyValueServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_value_svc_grpc_web_pb'
import {
  PropertyViewsServicePromiseClient
} from '@helpwave/proto-ts/services/property_svc/v1/property_views_svc_grpc_web_pb'
import { APIServiceUrls } from './config/wrapper'
import { WardOfflineServicePromiseClient } from './offline/tasks/ward_service'
import { RoomOfflineServicePromiseClient } from './offline/tasks/room_service'
import { BedOfflineServicePromiseClient } from './offline/tasks/bed_service'
import { PatientOfflineServicePromiseClient } from './offline/tasks/patient_service'
import { TaskOfflineServicePromiseClient } from './offline/tasks/task_service'
import { TaskTemplateOfflineServicePromiseClient } from './offline/tasks/task_template_service'
import { PropertyOfflineServicePromiseClient } from './offline/properties/property_service'
import { PropertyValueOfflineServicePromiseClient } from './offline/properties/property_value_service'
import { getAPIServiceConfig } from './config/config'
import { OrganizationOfflineServicePromiseClient } from './offline/users/organization_service'
import { UserOfflineServicePromiseClient } from './offline/users/user_service'

type APIServicesType = {
  organization: OrganizationOfflineServicePromiseClient,
  user: UserServicePromiseClient,
  ward: WardServicePromiseClient,
  room: RoomServicePromiseClient,
  bed: BedServicePromiseClient,
  patient: PatientServicePromiseClient,
  task: TaskServicePromiseClient,
  taskTemplates: TaskTemplateServicePromiseClient,
  property: PropertyServicePromiseClient,
  propertyValues: PropertyValueServicePromiseClient,
  propertyViewSource: PropertyViewsServicePromiseClient
}

const offlineServices: APIServicesType = {
  organization: new OrganizationOfflineServicePromiseClient(APIServiceUrls.users),
  user: new UserOfflineServicePromiseClient(APIServiceUrls.users),
  ward: new WardOfflineServicePromiseClient(APIServiceUrls.tasks),
  room: new RoomOfflineServicePromiseClient(APIServiceUrls.tasks),
  bed: new BedOfflineServicePromiseClient(APIServiceUrls.tasks),
  patient: new PatientOfflineServicePromiseClient(APIServiceUrls.tasks),
  task: new TaskOfflineServicePromiseClient(APIServiceUrls.tasks),
  taskTemplates: new TaskTemplateOfflineServicePromiseClient(APIServiceUrls.tasks),
  property: new PropertyOfflineServicePromiseClient(APIServiceUrls.property),
  propertyValues: new PropertyValueOfflineServicePromiseClient(APIServiceUrls.property),
  propertyViewSource: new PropertyViewsServicePromiseClient(APIServiceUrls.property) // TODO replace with an offline client
}

const onlineServices: APIServicesType = {
  organization: new OrganizationServicePromiseClient(APIServiceUrls.users),
  user: new UserServicePromiseClient(APIServiceUrls.users),
  ward: new WardServicePromiseClient(APIServiceUrls.tasks),
  room: new RoomServicePromiseClient(APIServiceUrls.tasks),
  bed: new BedServicePromiseClient(APIServiceUrls.tasks),
  patient: new PatientServicePromiseClient(APIServiceUrls.tasks),
  task: new TaskServicePromiseClient(APIServiceUrls.tasks),
  taskTemplates: new TaskTemplateServicePromiseClient(APIServiceUrls.tasks),
  property: new PropertyServicePromiseClient(APIServiceUrls.property),
  propertyValues: new PropertyValueServicePromiseClient(APIServiceUrls.property),
  propertyViewSource: new PropertyViewsServicePromiseClient(APIServiceUrls.property)
}

export const APIServices: APIServicesType = getAPIServiceConfig().offlineAPI ? offlineServices : onlineServices
